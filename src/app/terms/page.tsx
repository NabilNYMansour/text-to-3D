const h1Tailwind = "text-3xl font-bold mb-4";
const h2Tailwind = "text-2xl font-bold my-4";
const pTailwind = "mb-4";
const ulTailwind = "list-disc list-inside mb-4";
const anchorTailwind = "text-primary-foreground dark:text-primary hover:underline";

const Page = () => {
  return <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h1 className={h1Tailwind}>
      Privacy Policy and Terms of Service
    </h1>

    <h2 className={h2Tailwind}>
      Your Private Information
    </h2>
    <p className={pTailwind}>
      Text to 3D respects the privacy of its users and will not use data in its databases to compete with its users, market to its user&apos;s clients, advertise to, or contact them for any other means of profit.
    </p>

    <p className={pTailwind}>
      Text to 3D collects email addresses and usernames. It uses clerk for authentication and stores the email address and username of its users. It also stores the content of the projects you create, as well as the title of each project.
    </p>

    <p className={pTailwind}>
      All private information is never shared with or sold to any other organizations or services.
    </p>

    <p className={pTailwind}>
      Text to 3D does however reserve the right to react according to the law and authorities and investigate, prevent, or take action regarding illegal activities, suspected fraud, situations involving potential threats to the physical safety of any person, violations of the Terms of Service (section below), or as otherwise required by law.
    </p>

    <p className={pTailwind}>
      Text to 3D has implemented processes to guarantee the security of your data to the best of the capabilities of generally available technologies. Each user is assigned a unique username, which is required to access their account. It is your responsibility to protect the security of your login information.
    </p>

    <p className={pTailwind}>
      You have the right to access all of your private information. Send us an email to <a className={anchorTailwind} href="mailto:nabilnymansour@gmail.com">nabilnymansour@gmail.com</a> for a readable version of your data.
    </p>

    <h2 className={h2Tailwind}>
      Cookies and Analytics
    </h2>
    <p className={pTailwind}>
      Cookies are required to use Text to 3D, they are used to help the system identify users and mantain their session open while they work in the website. Without cookies Text to 3D won&apos;t operate.
    </p>
    <p className={pTailwind}>
      Text to 3D does not use cookies to track any of the users actions in the site, or store any of the content they type of search for.
    </p>
    <p className={pTailwind}>
      Text to 3D collects global, non user-specific information regarding overal website traffic volume, frequency of visits, type of browser and operating system.
    </p>

    <h2 className={h2Tailwind}>
      Terminating your Account
    </h2>
    <p className={pTailwind}>In the case you decide to delete your Text to 3D account, all the content you created and your profile will be deleted. Text to 3D runs the cleanup scripts at when you request deletion.</p>

    <h2>Changes to This Policy</h2>
    <p className={pTailwind}>
      Text to 3D&apos;s Privacy Policy may change from time to time. Text to 3D will not reduce its user&apos;s rights under this policy without explicit consent. Text to 3D will post any privacy policy changes on this page and, if the changes are significant, Text to 3D will provide a more prominent notice.
    </p>
    <p className={pTailwind}>
      If Text to 3D is acquired by or merged with another company, Text to 3D will notify the user before any personal information is transferred and becomes subject to a different privacy policy.
    </p>

    <h2 className={h2Tailwind}>
      Terms of Service
    </h2>
    <p className={pTailwind}>
      You must be at least 13 years old in order to use Text to 3D. If Text to 3D becomes aware that you aren&apos;t, and that therefore we have unknowingly collected some personal information about you, we will delete your account without further notice.
    </p>
    <p className={pTailwind}>
      Text to 3D is not responsible for the content you create. You are responsible for that content. Text to 3D reserves the right to suspend any user account without further notice if the user is found to be using the service for illegal activities.
    </p>
    <p className={pTailwind}>
      Text to 3D or its contributors are not responsible for content that can potentially damage hardware and/or software. The user agrees that the web is a delicate technology and you will assume all the risk when browsing, playing or editing the projects. However, Text to 3D is fully committed to provide a good browsing experience.
    </p>

    <h2 className={h2Tailwind}>
      Subscriptions
    </h2>
    <p className={pTailwind}>
      Some parts of Service are billed on a subscription basis (&quot;Subscription(s)&quot;). You will be billed in advance on a recurring and periodic basis (&quot;Billing Cycle&quot;). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
    </p>
    <p className={pTailwind}>
      At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or Text to 3D cancels it. You may cancel your Subscription renewal either through your online account management page or by contacting Text to 3D customer support team.
    </p>
    <p className={pTailwind}>
      A valid payment method, including credit card, is required to process the payment for your subscription. You shall provide Text to 3D with accurate and complete billing information including full name, address, state, zip code, telephone number, and a valid payment method information. By submitting such payment information, you automatically authorize Text to 3D to charge all Subscription fees incurred through your account to any such payment instruments.
    </p>
    <p className={pTailwind}>
      Should automatic billing fail to occur for any reason, Text to 3D will issue an electronic invoice indicating that you must proceed manually, within a certain deadline date, with the full payment corresponding to the billing period as indicated on the invoice.
    </p>

    <h2 className={h2Tailwind}>
      Text to 3D Uses
    </h2>
    <ul className={ulTailwind}>
      <li className={pTailwind}>
        <a className={anchorTailwind} href="https://nextjs.org/">Next.js</a>: for the website framework.
      </li>
      <li className={pTailwind}>
        <a className={anchorTailwind} href="https://mantine.dev/">Mantine</a>: for the UI components.
      </li>
      <li className={pTailwind}>
        <a className={anchorTailwind} href="https://clerk.com/">Clerk</a>: for the authentication system.
      </li>
      <li className={pTailwind}>
        <a className={anchorTailwind} href="https://stripe.com/">Stripe</a>: for the payment system.
      </li>
      <li className={pTailwind}>
        <a className={anchorTailwind} href="https://mixpanel.com/">Mixpanel</a>: for the analytics.
      </li>
    </ul>
  </div>;
};

export default Page;