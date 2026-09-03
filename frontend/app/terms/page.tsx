import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <main className="flex min-h-svh w-full flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: September 2, 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-medium">What Sunset Is</h2>
            <p>
              Sunset is a job application tracker with AI features to help with
              your job search. It can help tailor resume bullet points, draft
              cover letters, and analyze job fit based on your experience.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Using the App</h2>
            <p>
              You need an account to use Sunset. You&apos;re responsible for
              keeping your login credentials safe and for anything that happens
              under your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">What You Shouldn&apos;t Do</h2>
            <p>Please don&apos;t:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Use the app for anything illegal.</li>
              <li>
                Try to break into parts of the app you shouldn&apos;t access.
              </li>
              <li>Scrape the app with bots or automated tools.</li>
              <li>Pretend to be someone else.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Your Content</h2>
            <p>
              Anything you put into Sunset (resumes, cover letters, notes) stays
              yours. I don&apos;t claim ownership of your content. I just need a
              limited license to process it so the app can work (like generating
              bullet points from your resume).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">AI-Generated Content</h2>
            <p>
              The AI features generate content based on what you provide. A few
              things to keep in mind:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                AI output is a starting point. Always review and edit it before
                using it in a real application.
              </li>
              <li>
                I can&apos;t guarantee the AI output is always accurate or
                perfect.
              </li>
              <li>
                The quality of what you get depends on the quality of what you
                put in.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Liability</h2>
            <p>
              Sunset is a tool to help with your job search, not a guarantee of
              job interviews or offers. I&apos;m not responsible for any
              outcomes from using the app. Use it as one part of your job
              search, not the whole strategy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Account Deletion</h2>
            <p>
              You can delete your account at any time from the app settings. I
              may also remove accounts that violate these terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Service Availability & Data Loss</h2>
            <p>
              Sunset is a personal side project, not a commercial product. You
              should understand:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                The app may go offline without notice or warning.
              </li>
              <li>
                Data loss can happen during updates, migrations, or if the
                project is discontinued.
              </li>
              <li>
                I am not responsible for any data loss — no backups, no
                guarantees, no SLA.
              </li>
            </ul>
            <p>
              Use Sunset as a helpful tool, not as your only record. Keep your
              own backups of anything important.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Changes</h2>
            <p>
              I might update these terms over time. If I make significant
              changes, I&apos;ll update this page and the date above. Continuing
              to use the app after changes means you&apos;re okay with the
              updated terms.
            </p>
          </section>
        </div>

        <div className="mt-12 pb-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Back to app
          </Link>
        </div>
      </div>
    </main>
  );
}
