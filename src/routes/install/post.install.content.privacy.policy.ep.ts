import { FastifyReply, FastifyRequest } from 'fastify'
import { log, log_err } from '../../utility/logging'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { alertState } from '../../state/dialog'
import { content_get_by_name, content_create } from '../../model/content'
import { EP_CONTENTS } from '@tuber/shared'

const PRIVACY_POLICY_NAME = 'privacy-policy'

const PRIVACY_POLICY_HTML = `<h1>Privacy Policy</h1>
<p><em>Last updated: April 21, 2026</em></p>

<p>This Privacy Policy describes how we collect, use, and share information about you when you use our service. By using our service, you agree to the collection and use of information in accordance with this policy.</p>

<h2>1. Information We Collect</h2>
<p>We may collect the following types of information:</p>
<ul>
  <li><strong>Account information:</strong> When you register, we collect your email address and password (stored in hashed form).</li>
  <li><strong>Usage data:</strong> We collect information about how you interact with the service, including bookmarks you save and features you use.</li>
  <li><strong>Log data:</strong> Our servers automatically record information such as your IP address, browser type, and pages visited.</li>
</ul>

<h2>2. How We Use Your Information</h2>
<p>We use the information we collect to:</p>
<ul>
  <li>Provide, operate, and maintain the service.</li>
  <li>Authenticate your identity and manage your account.</li>
  <li>Send transactional emails such as account verification and password reset messages.</li>
  <li>Monitor and analyze usage patterns to improve the service.</li>
  <li>Detect and prevent fraudulent or abusive activity.</li>
</ul>

<h2>3. Information Sharing</h2>
<p>We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating the service, provided they agree to keep this information confidential.</p>
<p>We may also disclose your information when required by law or to protect the rights, property, or safety of us or others.</p>

<h2>4. Data Retention</h2>
<p>We retain your personal data for as long as your account is active or as needed to provide the service. You may request deletion of your account and associated data at any time by contacting us.</p>

<h2>5. Security</h2>
<p>We implement reasonable security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>

<h2>6. Cookies</h2>
<p>We use session cookies to maintain your authenticated session. You can configure your browser to refuse cookies, but doing so may prevent some features of the service from functioning correctly.</p>

<h2>7. Third-Party Services</h2>
<p>Our service may integrate with third-party platforms (such as Patreon) for authentication and membership verification. Your use of those services is governed by their respective privacy policies.</p>

<h2>8. Children's Privacy</h2>
<p>Our service is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.</p>

<h2>9. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date. Your continued use of the service after changes are posted constitutes your acceptance of the revised policy.</p>

<h2>10. Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us through the support options available in the application.</p>`

/** `POST /install/content/privacy-policy` endpoint handler */
export default async function post_install_content_privacy_policy_endpoint(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const existing = await content_get_by_name(PRIVACY_POLICY_NAME)

    if (existing) {
      const message = `Content '${PRIVACY_POLICY_NAME}' already exists. Nothing to do.`
      log(`[INFO] ${message}`)
      return reply.code(409).send({
        ...new JsonapiErrorBuilder()
          .withCode('DUPLICATE_RESOURCE')
          .withStatus(409)
          .withTitle(message)
          .withMeta('name', PRIVACY_POLICY_NAME)
          .build()
      })
    }

    const doc = await content_create({
      name: PRIVACY_POLICY_NAME,
      html: PRIVACY_POLICY_HTML,
      description: 'Privacy Policy page content',
    })

    const message = `Content '${PRIVACY_POLICY_NAME}' created successfully.`
    log(`[INFO] ${message}`)

    return reply.code(201).send(
      JsonapiResponseBuilder.forSingleResource({ name: doc.name }, EP_CONTENTS)
        .withId(doc.name)
        .withMeta({'status': 'created'})
        .withState(alertState(message))
        .build()
    )
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    log_err('[install/content/privacy-policy]', e)
    return reply.code(500).send(
      new JsonapiErrorBuilder()
        .withCode('INTERNAL_ERROR')
        .withStatus(500)
        .withTitle('Failed to install privacy policy content.')
        .withDetail(message)
        .build()
    )
  }
}
