import React from "react";

export const About = (): JSX.Element => {
  const navigationItems = [
    { label: "Home", href: "#" },
    { label: "About", href: "#" },
    { label: "Services", href: "#" },
    { label: "Events", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ];

  const galleryImages = [
    { src: "/img/rectangle-7.png", alt: "Healing session 1" },
    { src: "/img/rectangle-8.png", alt: "Healing session 2" },
    { src: "/img/rectangle-10.png", alt: "Healing session 3" },
    { src: "/img/rectangle-13.png", alt: "Healing session 4" },
    { src: "/img/rectangle-12.png", alt: "Healing session 5" },
  ];

  const quickLinks = ["Services", "Events", "Blog", "About", "Contact"];
  const legalLinks = ["Privacy Policy", "Terms & Conditions", "Disclaimer"];

  const testimonial = {
    name: "Jessica M., Tacoma, WA",
    image: "/img/ellipse-5.png",
    text: "❝I had no idea how deeply I was holding onto emotional pain until my first session with Deirdre. Her presence is calming, intuitive, and safe. I'm beyond grateful to have found her.❞",
  };

  const stars = Array(5).fill(null);

  return (
    <div
      className="bg-[#fefbf5] grid justify-items-center [align-items:start] w-screen"
      data-model-id="2021:611"
    >
      <div className="bg-[#fefbf5] w-[1440px] h-[6682px] relative">
        {/* Header Navigation */}
        <header className="absolute w-[1440px] h-[93px] top-0 left-0 rounded-[9px] overflow-hidden">
          <nav className="absolute w-[716px] h-[19px] top-[37px] left-[623px]">
            <div className="inline-flex items-center gap-[84px] relative">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="relative w-fit mt-[-1.00px] [font-family:'Figtree',Helvetica] font-semibold text-variable-collection-color-duplicate text-base tracking-[0] leading-[normal] whitespace-nowrap hover:opacity-80 transition-opacity"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <img
            className="absolute w-[248px] h-[92px] top-px left-[49px] aspect-[2.7] object-cover"
            alt="The reiki goddess"
            src="/img/the-reiki-goddess-4-25-x-5-5-in-facebook-cover-1.png"
          />
        </header>

        {/* Hero Section */}
        <section className="absolute w-[1374px] h-[916px] top-28 left-[66px]">
          <img
            className="w-[808px] left-[566px] absolute h-[808px] top-0 aspect-[1] object-cover"
            alt="Reiki healing session"
            src="/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc-2.png"
          />

          <img
            className="absolute w-[1308px] h-[515px] top-[401px] left-0"
            alt="Powerrangers"
            src="/img/powerrangers-6.png"
          />

          <h1 className="absolute w-[825px] top-20 left-0 [font-family:'Figtree',Helvetica] font-bold text-black text-[63.6px] tracking-[0] leading-[normal]">
            Experienced Reiki Master &amp; Sound Healer in Roy
          </h1>

          <p className="absolute w-[618px] top-[268px] left-0 [font-family:'Figtree',Helvetica] font-normal text-transparent text-base tracking-[0] leading-6">
            <span className="font-medium text-[#1c1b1b]">As an </span>
            <span className="font-bold italic text-[#0205b7]">
              experienced Reiki Master and certified Sound Healer,
            </span>
            <span className="font-medium text-[#1c1b1b]">
              {" "}
              my mission is to help you reconnect with your inner balance,
              release emotional blockages, and restore harmony in your body,
              mind, and spirit.
            </span>
          </p>

          <p className="absolute w-[618px] top-[268px] left-[690px] [font-family:'Figtree',Helvetica] font-normal text-transparent text-base tracking-[0] leading-6">
            <span className="font-medium text-[#1c1b1b]">
              With years of practice in{" "}
            </span>
            <span className="font-bold italic text-[#0205b7]">
              energy healing
            </span>
            <span className="font-medium text-[#1c1b1b]"> and </span>
            <span className="font-bold italic text-[#0205b7]">
              holistic wellness,{" "}
            </span>
            <span className="font-medium text-[#1c1b1b]">
              I combine gentle Reiki techniques with the vibrational power of
              sound therapy to create a deeply relaxing and transformative
              experience.
            </span>
          </p>
        </section>

        <p className="absolute w-[745px] top-[1075px] left-[66px] [font-family:'Figtree',Helvetica] font-medium text-[#1c1b1b] text-base tracking-[0] leading-6">
          Every healing session is tailored to your unique needs, ensuring you
          feel calm, centered, and revitalized. Whether you&apos;re seeking
          relief from stress, emotional healing, or spiritual growth — I am here
          to guide you on your journey to self-discovery and inner peace.
        </p>

        <button className="flex w-[137px] items-center justify-center gap-2.5 pl-[13px] pr-2.5 py-2.5 absolute top-[1104px] left-[1237px] rounded-[90px] border border-solid border-variable-collection-color-duplicate hover:bg-variable-collection-color-duplicate hover:text-white transition-colors">
          <span className="relative w-fit mt-[-1.00px] [font-family:'Figtree',Helvetica] font-medium text-variable-collection-color-duplicate text-base tracking-[0] leading-6 whitespace-nowrap">
            Learn More
          </span>
          <div className="relative w-5 h-5 aspect-[1]">
            <img
              className="absolute w-2.5 h-2.5 top-[5px] left-[5px]"
              alt="Arrow"
              src="/img/vector-1.svg"
            />
          </div>
        </button>

        {/* About Section */}
        <section className="absolute w-[1319px] h-[490px] top-[1368px] left-[66px]">
          <h2 className="absolute w-[514px] top-[41px] left-0 [font-family:'Figtree',Helvetica] font-bold text-black text-5xl tracking-[0] leading-[normal]">
            Experienced Reiki Master &amp; Sound Healer in Roy
          </h2>

          <p className="absolute w-[514px] top-[251px] left-0 [font-family:'Figtree',Helvetica] font-medium text-[#1c1b1b] text-base tracking-[0] leading-[23px]">
            Welcome! I&apos;m Deirdre Quigley, the founder of The Reiki Goddess
            Healing in Roy, Washington. With a deep passion for energy healing
            and holistic wellness, I blend the gentle art of Reiki with the
            transformative power of sound therapy to help you release stress,
            restore balance, and awaken your inner strength.
          </p>

          <div className="flex flex-col w-[352px] items-start gap-6 absolute top-[147px] left-[967px]">
            <p className="relative self-stretch mt-[-1.00px] [font-family:'Figtree',Helvetica] font-medium text-[#1c1b1b] text-base tracking-[0] leading-[23px]">
              My approach is warm, intuitive, and personalized — ensuring every
              session supports your unique journey toward healing and
              self-discovery.
            </p>

            <button className="flex w-[137px] items-center justify-center gap-2.5 pl-[13px] pr-2.5 py-2.5 relative flex-[0_0_auto] rounded-[90px] border border-solid border-variable-collection-color-duplicate hover:bg-variable-collection-color-duplicate hover:text-white transition-colors">
              <span className="relative w-fit mt-[-1.00px] [font-family:'Figtree',Helvetica] font-medium text-variable-collection-color-duplicate text-base tracking-[0] leading-6 whitespace-nowrap">
                Learn More
              </span>
              <div className="relative w-5 h-5 aspect-[1]">
                <img
                  className="absolute w-2.5 h-2.5 top-[5px] left-[5px]"
                  alt="Arrow"
                  src="/img/vector-1.svg"
                />
              </div>
            </button>
          </div>

          <div className="absolute w-[651px] h-[490px] top-0 left-[499px]">
            <img
              className="absolute w-[400px] h-[432px] top-0 left-10"
              alt="Deirdre Quigley portrait"
              src="/img/rectangle-5.png"
            />

            <div className="absolute top-96 left-0.5 rotate-[-5.24deg] [font-family:'Figtree',Helvetica] font-extrabold text-[#0205b71a] text-[63px] tracking-[6.30px] leading-[normal]">
              The Reiki Goddess
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="absolute w-[884px] h-[808px] top-[2106px] left-[556px]">
          <img
            className="w-[806px] left-[78px] absolute h-[808px] top-0 aspect-[1] object-cover"
            alt="Healing journey"
            src="/img/fb8b1754eb9a50a6cfaec02f5ef0c9bc-3.png"
          />

          <h2 className="absolute w-[616px] top-[43px] left-[115px] [font-family:'Figtree',Helvetica] font-bold text-black text-5xl tracking-[0] leading-[normal]">
            My Journey: Inspiring Personal Growth &amp; Renewal
          </h2>

          <p className="absolute w-[608px] top-[195px] left-[115px] [font-family:'Figtree',Helvetica] font-medium text-[#1c1b1b] text-base tracking-[0] leading-[23px]">
            My journey into the world of Reiki healing began with a personal
            quest for peace, balance, and deeper self-awareness. Over the years,
            I have transformed that passion into a mission — helping others
            release emotional blockages, restore harmony, and embrace their true
            potential. Through dedication, continuous learning, and heartfelt
            connection, I&apos;ve guided countless individuals toward healing
            and renewal, creating a space where transformation feels safe and
            empowering.
          </p>

          <div className="absolute w-[322px] h-[156px] top-[474px] left-0 rounded-[17px] overflow-hidden shadow-[0px_9px_0px_#0205b7,0px_42px_32.5px_-13px_#00000029] bg-[linear-gradient(122deg,rgba(2,5,183,1)_0%,rgba(99,213,249,1)_100%)]">
            <p className="absolute w-[247px] top-[70px] left-[25px] [font-family:'Figtree',Helvetica] font-medium text-variable-collection-color-6-duplicate text-lg tracking-[0] leading-[23px]">
              Skilled in using vibration and frequency for deep relaxation.
            </p>

            <div className="absolute top-[35px] left-[25px] [font-family:'Figtree',Helvetica] font-bold text-variable-collection-color-6-duplicate text-lg tracking-[0] leading-[normal]">
              Sound Healing Specialist
            </div>
          </div>

          <div className="absolute w-[322px] h-[156px] top-[522px] left-[358px] bg-white rounded-[17px] overflow-hidden shadow-[0px_9px_0px_#0205b7,0px_42px_32.5px_-13px_#00000029]">
            <p className="absolute w-[260px] top-[82px] left-[25px] [font-family:'Figtree',Helvetica] font-medium text-[#1c1b1b] text-lg tracking-[0] leading-[23px]">
              Supporting clients in emotional, physical, and spiritual growth.
            </p>

            <div className="absolute top-[47px] left-[25px] [font-family:'Figtree',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal]">
              Years of Experience
            </div>
          </div>
        </section>

        <img
          className="absolute w-[400px] h-[432px] top-[2078px] left-[156px] object-cover"
          alt="Healing space"
          src="/img/rectangle-6.png"
        />

        <div className="absolute w-[322px] h-[156px] top-[2628px] left-[198px] bg-white rounded-[17px] overflow-hidden shadow-[0px_9px_0px_#0205b7,0px_42px_32.5px_-13px_#00000029]">
          <p className="absolute w-[247px] top-[82px] left-[25px] [font-family:'Figtree',Helvetica] font-medium text-[#1c1b1b] text-lg tracking-[0] leading-[23px]">
            Advanced training in energy healing techniques.
          </p>

          <div className="absolute top-[47px] left-[25px] [font-family:'Figtree',Helvetica] font-bold text-black text-lg tracking-[0] leading-[normal]">
            Certified Reiki Master
          </div>
        </div>

        {/* Contact CTA Section */}
        <section className="absolute w-[1309px] h-[432px] top-[3004px] left-[66px] bg-[url(/img/2148847564-1.png)] bg-[100%_100%]">
          <h2 className="absolute w-[620px] top-[69px] left-[344px] [font-family:'Figtree',Helvetica] font-bold text-variable-collection-color-6-duplicate text-5xl text-center tracking-[0] leading-[normal]">
            Contact Me for Personalized Assistance
          </h2>

          <p className="absolute w-[890px] top-[209px] left-[209px] [font-family:'Figtree',Helvetica] font-medium text-variable-collection-color-6-duplicate text-base text-center tracking-[0] leading-6">
            At The Reiki Goddess Healing, your well-being is my highest
            priority. I understand how important it is to feel a sense of
            accomplishment, inner peace, and balance in life. That&apos;s why,
            after understanding your needs and goals, I create a fully
            customized healing plan just for you — guiding you every step of the
            way toward transformation.
          </p>

          <div className="inline-flex items-center gap-[35px] absolute top-[318px] left-[476px]">
            <button className="flex w-[184px] items-center justify-center gap-2.5 pl-[13px] pr-2.5 py-2.5 relative rounded-[90px] border border-solid border-white hover:bg-white hover:text-variable-collection-color-duplicate transition-colors">
              <span className="relative w-fit mt-[-1.00px] [font-family:'Figtree',Helvetica] font-medium text-variable-collection-color-6-duplicate text-base tracking-[0] leading-6 whitespace-nowrap">
                Book a Session
              </span>
              <div className="relative w-5 h-5 aspect-[1]">
                <img
                  className="absolute w-2.5 h-2.5 top-[5px] left-[5px]"
                  alt="Arrow"
                  src="/img/vector-3.svg"
                />
              </div>
            </button>

            <button className="flex w-[137px] items-center justify-center gap-2.5 pl-[13px] pr-2.5 py-2.5 relative rounded-[90px] hover:bg-white hover:text-variable-collection-color-duplicate transition-colors">
              <span className="relative w-fit mt-[-1.00px] [font-family:'Figtree',Helvetica] font-medium text-variable-collection-color-6-duplicate text-base tracking-[0] leading-6 whitespace-nowrap">
                Learn More
              </span>
              <div className="relative w-5 h-5 aspect-[1]">
                <img
                  className="absolute w-2.5 h-2.5 top-[5px] left-[5px]"
                  alt="Arrow"
                  src="/img/vector-5.svg"
                />
              </div>
            </button>
          </div>
        </section>

        {/* Image Gallery Section */}
        <section>
          <h2 className="absolute top-[3655px] left-[567px] [font-family:'Figtree',Helvetica] font-bold text-black text-5xl tracking-[0] leading-[normal]">
            Image Gallery
          </h2>

          <button className="flex w-[137px] items-center justify-center gap-2.5 pl-[13px] pr-2.5 py-2.5 absolute top-[4540px] left-[651px] rounded-[90px] border border-solid border-variable-collection-color-duplicate hover:bg-variable-collection-color-duplicate hover:text-white transition-colors">
            <span className="relative w-fit mt-[-1.00px] [font-family:'Figtree',Helvetica] font-medium text-variable-collection-color-duplicate text-base tracking-[0] leading-6 whitespace-nowrap">
              See More
            </span>
            <div className="relative w-5 h-5 aspect-[1]">
              <img
                className="absolute w-2.5 h-2.5 top-[5px] left-[5px]"
                alt="Arrow"
                src="/img/vector-2.svg"
              />
            </div>
          </button>

          <img
            className="absolute w-[898px] h-[343px] top-[3774px] left-[66px] object-cover"
            alt={galleryImages[0].alt}
            src={galleryImages[0].src}
          />

          <img
            className="absolute w-[391px] h-[343px] top-[3774px] left-[984px] object-cover"
            alt={galleryImages[1].alt}
            src={galleryImages[1].src}
          />

          <img
            className="absolute w-[391px] h-[343px] top-[4137px] left-[573px] object-cover"
            alt={galleryImages[2].alt}
            src={galleryImages[2].src}
          />

          <img
            className="absolute w-[487px] h-[343px] top-[4137px] left-[66px] object-cover"
            alt={galleryImages[3].alt}
            src={galleryImages[3].src}
          />

          <img
            className="absolute w-[391px] h-[343px] top-[4137px] left-[984px] object-cover"
            alt={galleryImages[4].alt}
            src={galleryImages[4].src}
          />
        </section>

        {/* Testimonials Section */}
        <section>
          <h2 className="absolute top-[4803px] left-[411px] [font-family:'Figtree',Helvetica] font-bold text-black text-5xl text-center tracking-[0] leading-[normal]">
            What My Clients Are Saying
          </h2>

          <div className="inline-flex items-center gap-[11.54px] absolute top-[5323px] left-[693px]">
            <div className="relative w-2.5 h-2.5 bg-variable-collection-color-duplicate rounded-[5px]" />
            <div className="relative w-2.5 h-2.5 bg-[#a9a9a9] rounded-[5px]" />
            <div className="relative w-2.5 h-2.5 bg-[#a9a9a9] rounded-[5px]" />
          </div>

          <div className="inline-flex items-center gap-14 absolute top-[5377px] left-[623px]">
            <button className="relative w-[69px] h-[69px] rounded-[56.62px] overflow-hidden border-[1.77px] border-solid border-variable-collection-color-duplicate hover:bg-variable-collection-color-duplicate transition-colors">
              <img
                className="absolute w-3 h-[19px] top-[26px] left-7"
                alt="Previous"
                src="/img/vector-1-1.svg"
              />
            </button>

            <button className="relative w-[69px] h-[69px] rounded-[56.62px] overflow-hidden border-[1.77px] border-solid border-variable-collection-color-duplicate rotate-180 hover:bg-variable-collection-color-duplicate transition-colors">
              <img
                className="absolute w-3 h-[19px] top-[25px] left-7 -rotate-180"
                alt="Next"
                src="/img/vector-1-2.svg"
              />
            </button>
          </div>

          <div className="absolute w-[1139px] h-[351px] top-[4922px] left-[150px] bg-[#a9944821] rounded-[20px] overflow-hidden shadow-[0px_0px_8px_#00000026]">
            <div className="flex flex-col w-[690px] items-center gap-[17px] relative top-[47px] left-56">
              <div className="flex flex-col items-center gap-[18px] relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col w-[200px] items-center gap-[11px] relative flex-[0_0_auto]">
                  <img
                    className="relative w-[65px] h-[65px]"
                    alt={testimonial.name}
                    src={testimonial.image}
                  />

                  <div className="relative w-fit ml-[-11.00px] mr-[-11.00px] [font-family:'Figtree',Helvetica] font-extrabold text-[#1c1b1b] text-xl text-center tracking-[0] leading-[29px] whitespace-nowrap">
                    {testimonial.name}
                  </div>
                </div>

                <p className="relative self-stretch [font-family:'Figtree',Helvetica] font-medium text-[#1c1b1b] text-xl text-center tracking-[0] leading-[29px]">
                  {testimonial.text}
                </p>
              </div>

              <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                {stars.map((_, index) => (
                  <img
                    key={index}
                    className="relative w-[24.38px] h-[23.29px]"
                    alt="Star"
                    src="/img/star-6.svg"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="flex flex-col w-[1440px] items-center gap-[161px] absolute top-[5666px] left-0">
          <div className="relative w-[1095px] h-[265px] rounded-[20px] overflow-hidden shadow-[9px_10px_0px_#63d5f9] bg-[url(/img/frame-33.png)] bg-cover bg-[50%_50%] bg-variable-collection-color-duplicate">
            <div className="relative w-[1049px] h-[213px] top-[26px] left-[23px]">
              <div className="absolute w-[1049px] h-[213px] top-0 left-0">
                <div className="absolute w-4 h-4 top-0 left-0 bg-white rounded-lg" />
                <div className="absolute w-4 h-4 top-0 left-[1033px] bg-white rounded-lg" />
                <div className="absolute w-4 h-4 top-[197px] left-[1033px] bg-white rounded-lg" />
                <div className="absolute w-4 h-4 top-[197px] left-0 bg-white rounded-lg" />
              </div>

              <h2 className="absolute top-[37px] left-[103px] [font-family:'Figtree',Helvetica] font-bold text-white text-5xl text-center tracking-[0] leading-[normal]">
                Ready to Begin Your Healing Journey?
              </h2>

              <button className="inline-flex items-center justify-center gap-2.5 pl-[13px] pr-2.5 py-2.5 absolute top-[145px] left-[408px] rounded-[90px] border border-solid border-variable-collection-color-6-duplicate hover:bg-variable-collection-color-6-duplicate hover:text-variable-collection-color-duplicate transition-colors">
                <span className="relative w-fit mt-[-1.00px] [font-family:'Figtree',Helvetica] font-medium text-variable-collection-color-6-duplicate text-base tracking-[0] leading-6 whitespace-nowrap">
                  Book Your Session Today
                </span>
                <div className="relative w-5 h-5 aspect-[1]">
                  <img
                    className="absolute w-2.5 h-2.5 top-[5px] left-[5px]"
                    alt="Arrow"
                    src="/img/vector-5.svg"
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Footer */}
          <footer className="relative self-stretch w-full h-[590px] bg-[#f7f7f7]">
            <p className="absolute w-[264px] top-52 left-[135px] [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[22px]">
              Creating beautiful, functional websites for small businesses.
            </p>

            <div className="flex flex-col w-[142px] items-start gap-6 absolute top-[92px] left-[1145px]">
              <div className="relative self-stretch mt-[-1.00px] [font-family:'Neue_Montreal-Medium',Helvetica] font-medium text-black text-xl tracking-[0] leading-[normal]">
                Follow us
              </div>

              <img
                className="relative flex-[0_0_auto] mr-[-2.00px]"
                alt="Social media links"
                src="/img/frame-2085660578.svg"
              />
            </div>

            <div className="flex flex-col w-[111px] items-start gap-7 absolute top-[92px] left-[599px]">
              <div className="relative self-stretch mt-[-1.00px] [font-family:'Neue_Montreal-Medium',Helvetica] font-medium text-black text-xl tracking-[0] leading-[normal]">
                Quick Links
              </div>

              <nav className="flex flex-col w-[76px] items-start gap-[25px] relative flex-[0_0_auto]">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className="relative self-stretch [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] hover:opacity-70 transition-opacity"
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex flex-col w-[111px] items-start gap-7 absolute top-[92px] left-[872px]">
              <div className="mt-[-1.00px] [font-family:'Neue_Montreal-Medium',Helvetica] font-medium text-xl relative self-stretch text-black tracking-[0] leading-[normal]">
                Legal
              </div>

              <nav className="flex flex-col w-[76px] items-start gap-[25px] relative flex-[0_0_auto]">
                {legalLinks.map((link, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`relative ${index < 2 ? "w-fit whitespace-nowrap" : "self-stretch"} [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[normal] hover:opacity-70 transition-opacity`}
                  >
                    {link}
                  </a>
                ))}
              </nav>
            </div>

            <img
              className="absolute w-[1325px] h-px top-[492px] left-[59px] object-cover"
              alt="Divider line"
              src="/img/line-56.svg"
            />

            <p className="absolute top-[532px] left-[578px] [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-[22px] whitespace-nowrap">
              © 2025 Thereikigoddess | All Rights Reserved.
            </p>

            <img
              className="absolute
w-[420px] h-[156px] top-[50px] left-[102px] aspect-[2.7] object-cover"
              alt="The reiki goddess"
              src="/img/the-reiki-goddess-4-25-x-5-5-in-facebook-cover-1-1.png"
            />
          </footer>
        </section>
      </div>
    </div>
  );
};
