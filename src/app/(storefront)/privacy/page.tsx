import type { Metadata } from "next";
import { LegalPageLayout, LegalSection } from "@/components/editorial/LegalPageLayout";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updated="02.13.26">
      <LegalSection title="Information We Collect">
        <p>We only collect information through the following ways:</p>
        <ul className="list-disc pl-[33px]">
          <li>Contact Form: When you reach out via our contact form, we may collect your name, email address, and any other details you choose to share with us.</li>
          <li>Meta Pixel: We use Meta Pixel to help us understand visitor interactions, measure campaign effectiveness, and improve our website experience. Meta Pixel may collect anonymized information about your browsing behavior.</li>
        </ul>
        <p>We do not collect other types of personal data such as phone numbers, payment information, or subscription details.</p>
      </LegalSection>
      <LegalSection title="Use of Information">
        <p>The information we collect is used to:</p>
        <ul className="list-disc pl-[33px]">
          <li>Respond to your inquiries and communicate with you</li>
          <li>Improve our website and services</li>
          <li>Analyze website traffic and user behavior</li>
          <li>Comply with legal obligations</li>
        </ul>
      </LegalSection>
      <LegalSection title="Disclosure of Your Information">
        <p>We do not sell, rent, or trade your personal information to third parties. Information may only be shared in the following limited situations:</p>
        <ul className="list-disc pl-[33px]">
          <li>To comply with legal obligations,</li>
          <li>To protect the rights and property of Artı Stüdyo,</li>
          <li>With your consent.</li>
        </ul>
        <p>Please note that anonymized data collected via Meta Pixel may be shared with Meta/Facebook services.</p>
      </LegalSection>
      <LegalSection title="Data Security">
        <p>We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
      </LegalSection>
      <LegalSection title="Your Choices">
        <p>You can choose to:</p>
        <ul className="list-disc pl-[33px]">
          <li>Not provide certain information</li>
          <li>Opt-out of Meta Pixel tracking through your browser settings</li>
          <li>Request information about what data we hold about you</li>
          <li>Request deletion of your information where applicable</li>
        </ul>
      </LegalSection>
      <LegalSection title="Third-Party Links">
        <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these sites. Please review their privacy policies before providing any personal information.</p>
      </LegalSection>
      <LegalSection title="Children's Privacy">
        <p>Our website is not directed at children under 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us to have it removed.</p>
      </LegalSection>
      <LegalSection title="Changes to Privacy Policy">
        <p>We may update this Privacy Policy from time to time. The updated version will be indicated by an updated date at the top of this page. Your continued use of our website after changes constitutes acceptance of the updated policy.</p>
      </LegalSection>
      <LegalSection title="Contact Us">
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <p>Articut™<br />Email: info@articut.com<br />Website: articut.com</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
