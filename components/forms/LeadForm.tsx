"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { Arrow, Button } from "@/components/ui/Button";
import { validateLead, type LeadField } from "@/lib/lead";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "failed" };

const F = site.form;

function errorText(field: LeadField, reason: "required" | "invalid") {
  if (field === "company") return F.errCompany.text;
  if (field === "email") return reason === "required" ? F.errEmailRequired.text : F.errEmail.text;
  return "";
}

export function LeadForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Partial<Record<LeadField, string>>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const check = validateLead(data);
    if ("error" in check) {
      setErrors({ [check.error.field]: errorText(check.error.field, check.error.reason) });
      e.currentTarget.querySelector<HTMLInputElement>(`[name="${check.error.field}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) return setStatus({ kind: "sent" });
      const body = await res.json().catch(() => ({}));
      if (res.status === 400 && body.field) {
        setErrors({ [body.field]: errorText(body.field, body.error) });
        return setStatus({ kind: "idle" });
      }
      setStatus({ kind: "failed" });
    } catch {
      setStatus({ kind: "failed" });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="grid justify-items-center gap-3 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-[#e6f4ea] text-[#2f7d4f]">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="text-2xl font-semibold">{F.successTitle.text}</h2>
        <p className="text-muted">{F.successBody.text}</p>
      </div>
    );
  }

  return (
    <form noValidate method="post" action="/api/lead" onSubmit={onSubmit} className="grid gap-5">
      <h2 className="text-xl font-semibold">{F.heading.text}</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="name" label={F.name.text} autoComplete="name" optional error={errors.name} />
        <Field name="company" label={F.company.text} autoComplete="organization" required error={errors.company} />
      </div>
      <Field name="email" label={F.email.text} type="email" autoComplete="email" required error={errors.email} />
      <Field name="message" label={F.message.text} multiline optional error={errors.message} />
      {/* Honeypot for bots; hidden from people and assistive tech */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {status.kind === "failed" && (
        <p role="alert" className="rounded-xl border border-brand/30 bg-brand-wash px-4 py-3 text-sm text-brand-ink">
          {ui.failed}{" "}
          <a className="font-medium underline" href={`mailto:${site.brand.email.text}`}>
            {site.brand.email.text}
          </a>
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={status.kind === "sending"} className="disabled:opacity-70">
          {status.kind === "sending" ? ui.sending : F.submit.text} <Arrow />
        </Button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  autoComplete,
  required,
  optional,
  multiline,
  error,
}: {
  name: LeadField;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
  multiline?: boolean;
  error?: string;
}) {
  const id = `lead-${name}`;
  const cls = `w-full rounded-xl border bg-paper px-4 py-3 text-[15px] outline-none transition placeholder:text-faint focus:border-ink/40 focus:ring-4 focus:ring-ink/5 ${
    error ? "border-brand" : "border-line"
  }`;
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-2">
        {label}
        {optional && <span className="ml-1 font-normal text-faint">({ui.optional})</span>}
      </label>
      {multiline ? (
        <textarea id={id} name={name} rows={4} className={cls} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          className={cls}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
        />
      )}
      {error && (
        <p id={`${id}-err`} className="text-sm text-brand-ink">
          {error}
        </p>
      )}
    </div>
  );
}
