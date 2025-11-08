import Link from 'next/link';
import { EmailForm } from '../components/EmailForm';
import { FeedbackForm } from '../components/FeedbackForm';

export default function HomePage() {
  return (
    <div className="container">
      <div className="hero">
        <h1>Convert Android XML to Jetpack Compose</h1>
        <p className="subtitle">
          The ultimate tool for developers to automatically convert Android XML layout files into clean, modern Jetpack Compose code.
        </p>
        
        <div className="code-comparison-container">
          <div className="code-box">
            <h3>Android XML</h3>
            <pre><code>{`<LinearLayout ...>
    <TextView
        android:text="Hello, World!" />
    <Button
        android:text="Click Me" />
</LinearLayout>`}</code></pre>
          </div>
          <div className="arrow-indicator">→</div>
          <div className="code-box compose">
            <h3>Jetpack Compose</h3>
            <pre><code>{`Column {
    Text("Hello, World!")
    Button(onClick = {}) {
        Text("Click Me")
    }
}`}</code></pre>
          </div>
        </div>

        <div className="more-examples">
          <h4>More Examples</h4>
          <div className="examples-list">
            <div>
              <strong>ConstraintLayout</strong>
              <pre><code>{`<ConstraintLayout ...>
    <ImageView ... />
    <TextView ... />
</ConstraintLayout>`}</code></pre>
              <pre><code>{`ConstraintLayout {
    val (image, text) = createRefs()
    Image(..., modifier = Modifier.constrainAs(image) { ... })
    Text(..., modifier = Modifier.constrainAs(text) { ... })
}`}</code></pre>
            </div>
            <div>
              <strong>RecyclerView</strong>
              <pre><code>{`<RecyclerView ... />`}</code></pre>
              <pre><code>{`LazyColumn {
    items(itemsList) { item ->
        // Item content
    }
}`}</code></pre>
            </div>
          </div>
        </div>

        <Link href="/converter" className="button primary-button pulse">
          Try the Converter Now!
        </Link>
        <p className="cta-desc">No registration required. Instantly convert your layouts!</p>
      </div>

      <section id="about" className="about-section">
        <div className="container">
          <h2>About xml2compose</h2>
          <p>
            xml2compose is a powerful tool designed to streamline the transition from traditional Android XML layouts to the modern, declarative UI framework, Jetpack Compose. Our mission is to save developers countless hours of manual conversion, reduce boilerplate code, and help teams adopt Compose faster and more efficiently.
          </p>
          <p>
            Whether you&apos;re migrating a large, existing project or just starting a new one, xml2compose provides an intuitive and reliable solution to bring your UI development into the future.
          </p>
          <p>
            Developed by a team of experienced Android engineers passionate about developer productivity and open source.
          </p>
        </div>
      </section>

      <section id="faq" className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <ul>
            <li>
              <strong>What XML layouts are supported?</strong>
              <p>
                Most common layouts and widgets are supported, including LinearLayout, ConstraintLayout, FrameLayout, TextView, Button, ImageView, RecyclerView, and more.
              </p>
            </li>
            <li>
              <strong>Is my data safe?</strong>
              <p>Yes. Uploaded XML files are processed securely and never stored. We respect your privacy.</p>
            </li>
            <li>
              <strong>How accurate is the conversion?</strong>
              <p>
                Our tool aims for high fidelity, but always review the output and adjust for project-specific needs.
              </p>
            </li>
            <li>
              <strong>Can I contribute or give feedback?</strong>
              <p>
                Absolutely! Visit our <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">GitHub</a> or use the feedback form below.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section id="contact" className="form-container">
        <div className="container">
          <h2>Get notified when we launch!</h2>
          <EmailForm />
          <p className="privacy-note">
            We respect your privacy. Your email will only be used for launch notifications.
          </p>
        </div>
      </section>

      <section id="feedback" className="feedback-section">
        <div className="container">
          <h2>Feedback & Suggestions</h2>
          <FeedbackForm />
        </div>
      </section>
    </div>
  );
}
