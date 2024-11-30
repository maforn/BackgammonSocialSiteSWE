<template>
  <div class="font-[sans-serif]">
    <div class="bg"></div>
    <div class="min-h-screen flex flex-col items-center justify-center">
      <div class="max-w-3xl max-md:max-w-lg p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md" id="box">
        <div class="md:max-w-md w-full px-4 py-4">
          <form method="POST" @submit.prevent="registerUser">
            <div class="mb-12">
              <h3 class="text-black text-3xl font-extrabold">{{ showRegisterForm ? 'Register' : 'Sign in' }}</h3>
              <p v-if="!showRegisterForm" class="text-sm mt-4 text-gray-800">
                Don't have an account?
                <a
                  @click.prevent="toggleRegisterLogin"
                  class="text-green-600 font-semibold hover:underline ml-1 whitespace-nowrap register-login-switch"
                >Register</a
                >
              </p>
              <p v-else class="text-sm mt-4 text-gray-800">
                Already have an account?
                <a
                  @click.prevent="toggleRegisterLogin"
                  class="text-green-600 font-semibold hover:underline ml-1 whitespace-nowrap register-login-switch"
                >Login</a
                >
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <label class="text-sm mb-2 block"
                >Username
                  <div class="relative flex items-center">
                    <input
                      name="name"
                      v-model="name"
                      type="text"
                      required
                      class="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                      placeholder="Enter username"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      class="w-4 h-4 absolute right-4"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                </label>
              </div>
              <div v-if="showRegisterForm">
                <label class="text-sm mb-2 block"
                >Email
                  <div class="relative flex items-center">
                    <input
                      name="email"
                      v-model="email"
                      type="email"
                      required
                      class="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                      placeholder="Enter email"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      class="w-4 h-4 absolute right-4"
                      viewBox="0 0 682.667 682.667"
                    >
                      <defs>
                        <clipPath id="a" clipPathUnits="userSpaceOnUse">
                          <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                        </clipPath>
                      </defs>
                      <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                        <path
                          fill="none"
                          stroke-miterlimit="10"
                          stroke-width="40"
                          d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                          data-original="#000000"
                        ></path>
                        <path
                          d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                          data-original="#000000"
                        ></path>
                      </g>
                    </svg>
                  </div>
                </label>
              </div>
              <div>
                <label class="text-sm mb-2 block"
                >Password
                  <div class="relative flex items-center">
                    <input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      name="password"
                      required
                      class="bg-white border border-gray-300 w-full text-sm text-gray-800 pl-4 pr-10 py-2.5 rounded-md outline-blue-500"
                      placeholder="Enter password"
                    />
                    <svg
                      v-if="!showPassword"
                      @click="togglePasswordVisibility"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      class="w-4 h-4 absolute right-4 cursor-pointer"
                      viewBox="0 0 128 128"
                    >
                      <path
                        d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                        data-original="#000000"
                      ></path>
                    </svg>
                    <svg
                      v-else
                      @click="togglePasswordVisibility"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      class="w-4 h-4 absolute right-4 cursor-pointer"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 4.5C7.305 4.5 3.135 7.305 1.5 12c1.635 4.695 5.805 7.5 10.5 7.5s8.865-2.805 10.5-7.5c-1.635-4.695-5.805-7.5-10.5-7.5zm0 13c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0-7.5c-1.655 0-3 1.345-3 3s1.345 3 3 3 3-1.345 3-3-1.345-3-3-3zm-1.5 3c0-.825.675-1.5 1.5-1.5s1.5.675 1.5 1.5-.675 1.5-1.5 1.5-1.5-.675-1.5-1.5z"
                        data-original="#000000"
                      ></path>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="#bbb" stroke-width="2" />
                    </svg>
                  </div>
                </label>
              </div>
              <div v-if="!showRegisterForm" class="flex flex-wrap items-center justify-between gap-4 mt-6">
                <div>
                  <router-link to="/forgot-password" class="text-green-600 font-semibold hover:underline">Forgot Password?</router-link>
                </div>
              </div>
              <div v-if="showRegisterForm" class="flex items-center">
                <input
                  id="tos"
                  name="tos"
                  type="checkbox"
                  required
                  class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
                />
                <label for="tos" class="ml-3 block text-sm">
                  I accept the
                  <a @click="toggleTerms" class="text-green-600 font-semibold hover:underline ml-1"
                  >Terms and Conditions</a
                  >
                </label>
              </div>
              <p class="mb-3 text-red-500">{{ errorMessage }}</p>
            </div>

            <div class="!mt-8">
              <input
                v-if="showRegisterForm"
                type="submit"
                class="w-full py-2.5 px-4 text-sm tracking-wider font-semibold rounded-md bg-green-600 hover:bg-green-700 text-white focus:outline-none"
                value="Create Account"
              />

              <input
                v-else
                type="submit"
                value="Login"
                class="w-full py-2.5 px-4 text-sm tracking-wider font-semibold rounded-md bg-green-600 hover:bg-green-700 text-white focus:outline-none"
              />
            </div>

            <div class="space-x-6 flex justify-center mt-6">
              <button type="button" class="border-none outline-none" @click="loginWithGoogle">
                <svg xmlns="http://www.w3.org/2000/svg" width="32px" class="inline" viewBox="0 0 512 512">
                  <path
                    fill="#fbbd00"
                    d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                    data-original="#fbbd00"
                  />
                  <path
                    fill="#0f9d58"
                    d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                    data-original="#0f9d58"
                  />
                  <path
                    fill="#31aa52"
                    d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                    data-original="#31aa52"
                  />
                  <path
                    fill="#3c79e6"
                    d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                    data-original="#3c79e6"
                  />
                  <path
                    fill="#cf2d48"
                    d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                    data-original="#cf2d48"
                  />
                  <path
                    fill="#eb4132"
                    d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                    data-original="#eb4132"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div v-if="showTerms" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div class="bg-white p-8 pb-3 rounded-md max-w-4xl w-full max-h-full">
          <h1 class="text-3xl font-bold mb-4">Terms and Conditions</h1>
          <div class="max-h-96 overflow-y-auto" id="tos-text">
            <h1 class="text-2xl font-bold">Privacy Policy</h1>
            <p class="text-sm text-gray-500">Last updated: November 01, 2024</p>
            <p>
              This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your
              information when You use the Service and tells You about Your privacy rights and how the law protects You.
            </p>
            <p>
              We use Your Personal data to provide and improve the Service. By using the Service, You agree to the
              collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been
              created with the help of the
              <a href="https://www.termsfeed.com/privacy-policy-generator/" target="_blank">Privacy Policy Generator</a
              >.
            </p>
            <h2 class="text-xl font-bold">Interpretation and Definitions</h2>
            <h3 class="text-lg font-bold">Interpretation</h3>
            <p>
              The words of which the initial letter is capitalized have meanings defined under the following conditions.
              The following definitions shall have the same meaning regardless of whether they appear in singular or in
              plural.
            </p>
            <h3 class="text-lg font-bold">Definitions</h3>
            <p>For the purposes of this Privacy Policy:</p>
            <ul>
              <li>
                <p>
                  <strong>Account</strong> means a unique account created for You to access our Service or parts of our
                  Service.
                </p>
              </li>
              <li>
                <p>
                  <strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control
                  with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest
                  or other securities entitled to vote for election of directors or other managing authority.
                </p>
              </li>
              <li>
                <p>
                  <strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;,
                  &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to Social Backgammon.
                </p>
              </li>
              <li>
                <p>
                  <strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other
                  device by a website, containing the details of Your browsing history on that website among its many
                  uses.
                </p>
              </li>
              <li>
                <p><strong>Country</strong> refers to: Italy</p>
              </li>
              <li>
                <p>
                  <strong>Device</strong> means any device that can access the Service such as a computer, a cellphone
                  or a digital tablet.
                </p>
              </li>
              <li>
                <p>
                  <strong>Personal Data</strong> is any information that relates to an identified or identifiable
                  individual.
                </p>
              </li>
              <li>
                <p><strong>Service</strong> refers to the Website.</p>
              </li>
              <li>
                <p>
                  <strong>Service Provider</strong> means any natural or legal person who processes the data on behalf
                  of the Company. It refers to third-party companies or individuals employed by the Company to
                  facilitate the Service, to provide the Service on behalf of the Company, to perform services related
                  to the Service or to assist the Company in analyzing how the Service is used.
                </p>
              </li>
              <li>
                <p>
                  <strong>Third-party Social Media Service</strong> refers to any website or any social network website
                  through which a User can log in or create an account to use the Service.
                </p>
              </li>
              <li>
                <p>
                  <strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the
                  Service or from the Service infrastructure itself (for example, the duration of a page visit).
                </p>
              </li>
              <li>
                <p>
                  <strong>Website</strong> refers to Social Backgammon, accessible from
                  <a href="backgammon.hopto.org" rel="external nofollow noopener" target="_blank"
                  >backgammon.hopto.org</a
                  >
                </p>
              </li>
              <li>
                <p>
                  <strong>You</strong> means the individual accessing or using the Service, or the company, or other
                  legal entity on behalf of which such individual is accessing or using the Service, as applicable.
                </p>
              </li>
            </ul>
            <h2 class="text-xl font-bold">Collecting and Using Your Personal Data</h2>
            <h3 class="text-lg font-bold">Types of Data Collected</h3>
            <h4 class="font-bold">Personal Data</h4>
            <p>
              While using Our Service, We may ask You to provide Us with certain personally identifiable information
              that can be used to contact or identify You. Personally identifiable information may include, but is not
              limited to:
            </p>
            <ul>
              <li>
                <p>Email address</p>
              </li>
              <li>
                <p>Usage Data</p>
              </li>
            </ul>
            <h4 class="font-bold">Usage Data</h4>
            <p>Usage Data is collected automatically when using the Service.</p>
            <p>
              Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address),
              browser type, browser version, the pages of our Service that You visit, the time and date of Your visit,
              the time spent on those pages, unique device identifiers and other diagnostic data.
            </p>
            <p>
              When You access the Service by or through a mobile device, We may collect certain information
              automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique
              ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet
              browser You use, unique device identifiers and other diagnostic data.
            </p>
            <p>
              We may also collect information that Your browser sends whenever You visit our Service or when You access
              the Service by or through a mobile device.
            </p>
            <h4 class="font-bold">Information from Third-Party Social Media Services</h4>
            <p>
              The Company allows You to create an account and log in to use the Service through the following
              Third-party Social Media Services:
            </p>
            <ul>
              <li>Google</li>
              <li>Facebook</li>
            </ul>
            <p>
              If You decide to register through or otherwise grant us access to a Third-Party Social Media Service, We
              may collect Personal data that is already associated with Your Third-Party Social Media Service's account,
              such as Your name, Your email address, Your activities or Your contact list associated with that account.
            </p>
            <p>
              You may also have the option of sharing additional information with the Company through Your Third-Party
              Social Media Service's account. If You choose to provide such information and Personal Data, during
              registration or otherwise, You are giving the Company permission to use, share, and store it in a manner
              consistent with this Privacy Policy.
            </p>
            <h4 class="font-bold">Tracking Technologies and Cookies</h4>
            <p>
              We use Cookies and similar tracking technologies to track the activity on Our Service and store certain
              information. Tracking technologies used are beacons, tags, and scripts to collect and track information
              and to improve and analyze Our Service. The technologies We use may include:
            </p>
            <ul>
              <li>
                <strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can
                instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You
                do not accept Cookies, You may not be able to use some parts of our Service. Unless you have adjusted
                Your browser setting so that it will refuse Cookies, our Service may use Cookies.
              </li>
              <li>
                <strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain small
                electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel
                gifs) that permit the Company, for example, to count users who have visited those pages or opened an
                email and for other related website statistics (for example, recording the popularity of a certain
                section and verifying system and server integrity).
              </li>
            </ul>
            <p>
              Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on Your
              personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You
              close Your web browser. You can learn more about cookies on
              <a href="https://www.termsfeed.com/blog/cookies/#What_Are_Cookies" target="_blank">TermsFeed website</a>
              article.
            </p>
            <p>We use both Session and Persistent Cookies for the purposes set out below:</p>
            <ul>
              <li>
                <p><strong>Necessary / Essential Cookies</strong></p>
                <p>Type: Session Cookies</p>
                <p>Administered by: Us</p>
                <p>
                  Purpose: These Cookies are essential to provide You with services available through the Website and to
                  enable You to use some of its features. They help to authenticate users and prevent fraudulent use of
                  user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We
                  only use these Cookies to provide You with those services.
                </p>
              </li>
              <li>
                <p><strong>Cookies Policy / Notice Acceptance Cookies</strong></p>
                <p>Type: Persistent Cookies</p>
                <p>Administered by: Us</p>
                <p>Purpose: These Cookies identify if users have accepted the use of cookies on the Website.</p>
              </li>
              <li>
                <p><strong>Functionality Cookies</strong></p>
                <p>Type: Persistent Cookies</p>
                <p>Administered by: Us</p>
                <p>
                  Purpose: These Cookies allow us to remember choices You make when You use the Website, such as
                  remembering your login details or language preference. The purpose of these Cookies is to provide You
                  with a more personal experience and to avoid You having to re-enter your preferences every time You
                  use the Website.
                </p>
              </li>
            </ul>
            <p>
              For more information about the cookies we use and your choices regarding cookies, please visit our Cookies
              Policy or the Cookies section of our Privacy Policy.
            </p>
            <h3 class="text-lg font-bold">Use of Your Personal Data</h3>
            <p>The Company may use Personal Data for the following purposes:</p>
            <ul>
              <li>
                <p>
                  <strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.
                </p>
              </li>
              <li>
                <p>
                  <strong>To manage Your Account:</strong> to manage Your registration as a user of the Service. The
                  Personal Data You provide can give You access to different functionalities of the Service that are
                  available to You as a registered user.
                </p>
              </li>
              <li>
                <p>
                  <strong>For the performance of a contract:</strong> the development, compliance and undertaking of the
                  purchase contract for the products, items or services You have purchased or of any other contract with
                  Us through the Service.
                </p>
              </li>
              <li>
                <p>
                  <strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent
                  forms of electronic communication, such as a mobile application's push notifications regarding updates
                  or informative communications related to the functionalities, products or contracted services,
                  including the security updates, when necessary or reasonable for their implementation.
                </p>
              </li>
              <li>
                <p>
                  <strong>To provide You</strong> with news, special offers and general information about other goods,
                  services and events which we offer that are similar to those that you have already purchased or
                  enquired about unless You have opted not to receive such information.
                </p>
              </li>
              <li>
                <p><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</p>
              </li>
              <li>
                <p>
                  <strong>For business transfers:</strong> We may use Your information to evaluate or conduct a merger,
                  divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of
                  Our assets, whether as a going concern or as part of bankruptcy, liquidation, or similar proceeding,
                  in which Personal Data held by Us about our Service users is among the assets transferred.
                </p>
              </li>
              <li>
                <p>
                  <strong>For other purposes</strong>: We may use Your information for other purposes, such as data
                  analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to
                  evaluate and improve our Service, products, services, marketing and your experience.
                </p>
              </li>
            </ul>
            <p>We may share Your personal information in the following situations:</p>
            <ul>
              <li>
                <strong>With Service Providers:</strong> We may share Your personal information with Service Providers
                to monitor and analyze the use of our Service, to contact You.
              </li>
              <li>
                <strong>For business transfers:</strong> We may share or transfer Your personal information in
                connection with, or during negotiations of, any merger, sale of Company assets, financing, or
                acquisition of all or a portion of Our business to another company.
              </li>
              <li>
                <strong>With Affiliates:</strong> We may share Your information with Our affiliates, in which case we
                will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and
                any other subsidiaries, joint venture partners or other companies that We control or that are under
                common control with Us.
              </li>
              <li>
                <strong>With business partners:</strong> We may share Your information with Our business partners to
                offer You certain products, services or promotions.
              </li>
              <li>
                <strong>With other users:</strong> when You share personal information or otherwise interact in the
                public areas with other users, such information may be viewed by all users and may be publicly
                distributed outside. If You interact with other users or register through a Third-Party Social Media
                Service, Your contacts on the Third-Party Social Media Service may see Your name, profile, pictures and
                description of Your activity. Similarly, other users will be able to view descriptions of Your activity,
                communicate with You and view Your profile.
              </li>
              <li>
                <strong>With Your consent</strong>: We may disclose Your personal information for any other purpose with
                Your consent.
              </li>
            </ul>
            <h3 class="text-lg font-bold">Retention of Your Personal Data</h3>
            <p>
              The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in
              this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our
              legal obligations (for example, if we are required to retain your data to comply with applicable laws),
              resolve disputes, and enforce our legal agreements and policies.
            </p>
            <p>
              The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained
              for a shorter period of time, except when this data is used to strengthen the security or to improve the
              functionality of Our Service, or We are legally obligated to retain this data for longer time periods.
            </p>
            <h3 class="text-lg font-bold">Transfer of Your Personal Data</h3>
            <p>
              Your information, including Personal Data, is processed at the Company's operating offices and in any
              other places where the parties involved in the processing are located. It means that this information may
              be transferred to — and maintained on — computers located outside of Your state, province, country or
              other governmental jurisdiction where the data protection laws may differ than those from Your
              jurisdiction.
            </p>
            <p>
              Your consent to this Privacy Policy followed by Your submission of such information represents Your
              agreement to that transfer.
            </p>
            <p>
              The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in
              accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an
              organization or a country unless there are adequate controls in place including the security of Your data
              and other personal information.
            </p>
            <h3 class="text-lg font-bold">Delete Your Personal Data</h3>
            <p>
              You have the right to delete or request that We assist in deleting the Personal Data that We have
              collected about You.
            </p>
            <p>Our Service may give You the ability to delete certain information about You from within the Service.</p>
            <p>
              You may update, amend, or delete Your information at any time by signing in to Your Account, if you have
              one, and visiting the account settings section that allows you to manage Your personal information. You
              may also contact Us to request access to, correct, or delete any personal information that You have
              provided to Us.
            </p>
            <p>
              Please note, however, that We may need to retain certain information when we have a legal obligation or
              lawful basis to do so.
            </p>
            <h3 class="text-lg font-bold">Disclosure of Your Personal Data</h3>
            <h4 class="font-bold">Business Transactions</h4>
            <p>
              If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred.
              We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy
              Policy.
            </p>
            <h4 class="font-bold">Law enforcement</h4>
            <p>
              Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do
              so by law or in response to valid requests by public authorities (e.g. a court or a government agency).
            </p>
            <h4 class="font-bold">Other legal requirements</h4>
            <p>
              The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:
            </p>
            <ul>
              <li>Comply with a legal obligation</li>
              <li>Protect and defend the rights or property of the Company</li>
              <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
              <li>Protect the personal safety of Users of the Service or the public</li>
              <li>Protect against legal liability</li>
            </ul>
            <h3 class="text-lg font-bold">Security of Your Personal Data</h3>
            <p>
              The security of Your Personal Data is important to Us, but remember that no method of transmission over
              the Internet, or method of electronic storage is 100% secure. While We strive to use commercially
              acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
            </p>
            <h2 class="text-xl font-bold">Children's Privacy</h2>
            <p>
              Our Service does not address anyone under the age of 13. We do not knowingly collect personally
              identifiable information from anyone under the age of 13. If You are a parent or guardian and You are
              aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We
              have collected Personal Data from anyone under the age of 13 without verification of parental consent, We
              take steps to remove that information from Our servers.
            </p>
            <p>
              If We need to rely on consent as a legal basis for processing Your information and Your country requires
              consent from a parent, We may require Your parent's consent before We collect and use that information.
            </p>
            <h2 class="text-2xl font-bold">Links to Other Websites</h2>
            <p>
              Our Service may contain links to other websites that are not operated by Us. If You click on a third party
              link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy
              of every site You visit.
            </p>
            <p>
              We have no control over and assume no responsibility for the content, privacy policies or practices of any
              third party sites or services.
            </p>
            <h2 class="text-2xl font-bold">Changes to this Privacy Policy</h2>
            <p>
              We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new
              Privacy Policy on this page.
            </p>
            <p>
              We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming
              effective and update the &quot;Last updated&quot; date at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
              are effective when they are posted on this page.
            </p>
            <h2 class="text-2xl font-bold">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, You can contact us:</p>
            <ul>
              <li>
                By visiting this page on our website:
                <a href="backgammon.hopto.org" rel="external nofollow noopener" target="_blank">backgammon.hopto.org</a>
              </li>
            </ul>
          </div>
          <div class="flex justify-center items-center">
            <button @click="toggleTerms" class="px-4 py-2 mt-3 bg-gray-700 text-white rounded-md hover:bg-gray-800">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { registerOrLogin, loginWithGoogle } from '@/services/authService'

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const showRegisterForm = ref(false)
    const showPassword = ref(false)
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const showTerms = ref(false)
    const errorMessage = ref('')

    const goBack = () => {
      window.history.back()
    }

    const toggleTerms = () => {
      showTerms.value = !showTerms.value
    }

    const toggleRegisterLogin = () => {
      showRegisterForm.value = !showRegisterForm.value
      showPassword.value = false
    }

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const registerUser = async () => {
      try {
        errorMessage.value = ''
        await registerOrLogin(name.value, password.value, email.value, showRegisterForm.value)
        await router?.push({ name: 'home' }) // Navigate to home
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          errorMessage.value = error.response.data.detail
        } else {
          console.error('Error registering user:', error)
        }
      }
    }

    return {
      goBack,
      showRegisterForm,
      showPassword,
      toggleRegisterLogin,
      togglePasswordVisibility,
      name,
      email,
      password,
      registerUser,
      showTerms,
      toggleTerms,
      errorMessage,
      loginWithGoogle
    }
  }
})
</script>

<style scoped>
.bg {
  /* Photo credit: FIGIST CO on Unsplash */
  background-image: url('../assets/bg.jpg');
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  z-index: -1;
  overflow: hidden;
  filter: brightness(50%);
  transform: scaleX(-1);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

#box {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(70%);
}

.register-login-switch:hover {
  cursor: pointer;
}

#tos-text p {
  line-height: 32px; /* within paragraph */
  margin-bottom: 30px; /* between paragraphs */
}
</style>
