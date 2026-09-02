import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-svh w-full flex-col items-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: September 2, 2026
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-medium">What This App Is</h2>
            <p>
              Sunset is a job application tracker I built to help manage job
              searching. It uses AI to help with things like tailoring resume
              bullet points and cover letters to specific job listings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">What I Collect</h2>
            <p>Sunset collects only what it needs to work:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Your email</strong> for signing in and account
                management.
              </li>
              <li>
                <strong>Your resume data</strong> (work history, education,
                skills) that you upload or create in the app.
              </li>
              <li>
                <strong>Job application data</strong> you add, like companies,
                positions, and notes.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">How I Use Your Data</h2>
            <p>Your data is used to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Run the app and keep your account working.</li>
              <li>
                Generate tailored bullet points and cover letters from your
                resume.
              </li>
              <li>Analyze job descriptions to help with job fit.</li>
            </ul>
            <p>I don&apos;t sell your data or use it for advertising.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Data Storage</h2>
            <p>
              Your data is stored on secure servers with encryption. You can
              delete your account and all your data at any time from the app
              settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">AI Features</h2>
            <p>
              The AI features (bullet points, cover letters, job fit analysis)
              use your resume and job data to generate outputs. I don&apos;t use
              your data to train AI models. Everything you put in stays yours.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Your Rights</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You can access all your data in the app.</li>
              <li>You can correct or update anything you&apos;ve entered.</li>
              <li>You can delete your account and all associated data.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Cookies</h2>
            <p>
              Sunset only uses essential cookies for login sessions. No tracking
              cookies, no third-party analytics.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Changes</h2>
            <p>
              If this policy changes, I&apos;ll update this page and the date
              above.
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
