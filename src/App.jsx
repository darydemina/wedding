import React, { useEffect, useRef, useState } from "react";

const ASSETS = {
  meadow: "/assets/mirrored/images/Frame_1321317361_1-326d2f0e5f.png",
  photoMaria: "/assets/custom/darya-fast.jpg",
  photoAlexey: "/assets/custom/daniil.jpg",
  star: "/assets/mirrored/images/Star_1-8ad14f0585.svg",
  starAlt: "/assets/mirrored/images/Star_2-5efb369037.svg",
  names: "/assets/custom/darya-daniil-names-transparent.png",
  topFlap: "/assets/mirrored/images/Frame_1321317328-c51e1ec015.png",
  bottomFlap: "/assets/mirrored/images/Frame_1321317329-4d4fd1da66.png",
  glassLeft: "/assets/mirrored/images/1-86bc82f266.png",
  glassRight: "/assets/mirrored/images/2-58b0d10695.png",
  tornCreamTop: "/assets/mirrored/images/Frame_1321317327-9180a5f389.png",
  tornGreenTop: "/assets/mirrored/images/Frame_1321317326-817b4b261b.png",
  tornCreamLarge: "/assets/mirrored/images/1801163755-404fdf935a.png",
  tornGreenLarge: "/assets/mirrored/images/1801163754-7874f690e5.png",
  augustBranch: "/assets/mirrored/images/photo_2026-04-28_21--858011d5c2.png",
  augustLine: "/assets/mirrored/images/svg_1774963588561-d940e1f1a0.svg",
  clinkDark: "/assets/mirrored/images/Frame_1321317135-fe9e7448c1.svg",
  clinkLight: "/assets/mirrored/images/photo-08d221af1f.svg",
  augustHeart: "/assets/mirrored/images/Frame_1321317137-55afa968d6.svg",
  augustFlowers: "/assets/mirrored/images/image_1738-aafb09438d.png",
  locationBeliyPrichal: "/assets/custom/beliy-prichal-location-optimized.jpg",
  locationRings: "/assets/mirrored/images/Frame_1321316900-0dc5c38db4.png",
  locationDinner: "/assets/mirrored/images/Frame_1321317164-b5247cf801.png",
  dressBranchLeft: "/assets/mirrored/images/image_1736-8fb6067b5b.png",
  dressBranchRight: "/assets/mirrored/images/image_1739-b36f2e6539.png",
  silkBeige: "/assets/mirrored/images/Frame_1321317151-3b77bd487a.png",
  silkBrown: "/assets/mirrored/images/_21-00b0742e00.png",
  silkChampagne: "/assets/mirrored/images/photo-03f0aa042f.png",
  silkGreen: "/assets/mirrored/images/Mask_group-3-afecab1dbd.png",
  silkOlive: "/assets/mirrored/images/Frame_1321317154-3a33d02602.png",
  silkTaupe: "/assets/mirrored/images/Frame_1321317155-439336ee9f.png",
  silkSage: "/assets/mirrored/images/Frame_1321317157-10186a781a.png",
  silkIvory: "/assets/mirrored/images/Frame_1321317158-c026fe3aed.png",
  dressWomenA: "/assets/mirrored/images/1_9-4b4e571759.png",
  dressWomenB: "/assets/mirrored/images/2_9-5690aecac8.png",
  dressMenA: "/assets/mirrored/images/4_3-5f87dfba3c.png",
  dressMenB: "/assets/mirrored/images/3_6-ed63e1a744.png",
  shadowPalm: "/assets/mirrored/images/Shadows-73d4d64bc9.jpg",
  rsvpTorn: "/assets/mirrored/images/Frame_1321317365-52ad90f223.png",
  chatLeaf: "/assets/mirrored/images/noroot-8a481475a4.png",
  leafStrip: "/assets/mirrored/images/noroot-26ff94e1bf.png",
  guestPhone: "/assets/mirrored/images/iPhone_16_Pro-5590e1f81c.png",
  contactsRock: "/assets/mirrored/images/Frame_1321317423-b68f1e1403.png",
  closingPhoto: "/assets/custom/closing-couple.jpg",
  weddingMusic: "/assets/custom/wedding-music.mp3",
};

const targetDate = new Date("2026-07-18T12:15:00+03:00");
const ENVELOPE_OPEN_MS = 2000;
const TELEGRAM_CHAT_URL = "https://t.me/+1oYKdaqk1NxlZWZi";
const TELEGRAM_BOT_URL = "https://t.me/srm_list_bot";

const AUGUST_DAYS = ["16", "17", "18", "19", "20"];

const AUGUST_ITEMS = [
  { time: "16:00", label: "Сбор гостей" },
  { time: "16:30", label: "Выездная регистрация" },
  { time: "17:00", label: "Начало банкета" },
  { time: "22:00", label: "Завершение дня" },
];

async function sendRsvpToTelegram({ name, guestCount, attendance }) {
  const response = await fetch("/api/rsvp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, guestCount, attendance }),
  });

  if (!response.ok) {
    throw new Error("telegram-send-failed");
  }
}

const DETAILS_NOTES = [
  "Если у вас есть желание подготовить для нас сюрприз, тост, номер или любую другую активность на празднике — будем очень рады! Чтобы всё прошло красиво и без свадебного хаоса, напишите нашему классному ведущему. Он с удовольствием поможет всё скоординировать, подскажет по формату и найдёт для вашей идеи идеальное место в программе вечера.",
  "Не переживайте, мы не будем вызывать гостей говорить тосты. Во время нашей свадьбы будет действовать «открытый микрофон»",
];

const DRESS_IMAGES = [
  ASSETS.dressWomenA,
  ASSETS.dressWomenB,
  ASSETS.dressMenA,
  ASSETS.dressMenB,
];

const SILK_SWATCHES = [
  { src: ASSETS.silkBrown, className: "silk silk-1" },
  { src: ASSETS.silkChampagne, className: "silk silk-2" },
  { src: ASSETS.silkBeige, className: "silk silk-3" },
  { src: ASSETS.silkSage, className: "silk silk-4" },
  { src: ASSETS.silkGreen, className: "silk silk-5" },
  { src: ASSETS.silkOlive, className: "silk silk-6" },
  { src: ASSETS.silkTaupe, className: "silk silk-7" },
  { src: ASSETS.silkIvory, className: "silk silk-8" },
];

const IMAGE_PRELOADS_AFTER_OPEN = [
  ASSETS.glassLeft,
  ASSETS.glassRight,
  ASSETS.tornCreamTop,
  ASSETS.tornGreenTop,
  ASSETS.tornCreamLarge,
  ASSETS.tornGreenLarge,
  ASSETS.leafStrip,
  ASSETS.rsvpTorn,
  ASSETS.shadowPalm,
  ASSETS.augustBranch,
  ASSETS.augustFlowers,
  ASSETS.locationBeliyPrichal,
  ASSETS.dressBranchLeft,
  ASSETS.dressBranchRight,
  ASSETS.chatLeaf,
  ASSETS.guestPhone,
  ASSETS.contactsRock,
  ASSETS.closingPhoto,
];

function getCountdown() {
  const diff = Math.max(0, targetDate.getTime() - Date.now());
  const seconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

function useCountdown() {
  const [time, setTime] = useState(getCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => setTime(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return time;
}

function useRevealOnScroll(enabled) {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const nodes = [...document.querySelectorAll(".reveal")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.14 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [enabled]);
}

function useScrollMotion(enabled) {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const nodes = [...document.querySelectorAll("[data-scroll-motion]")];
    if (!nodes.length) {
      return undefined;
    }

    let frameId = 0;

    const update = () => {
      const viewportHeight = window.innerHeight || 1;

      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const progress = Math.min(
          1,
          Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)),
        );

        node.style.setProperty("--scroll-progress", progress.toFixed(3));
      });

      frameId = 0;
    };

    const scheduleUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [enabled]);
}

function useImagePreloader(enabled) {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handles = IMAGE_PRELOADS_AFTER_OPEN.map((src) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
      return image;
    });

    return () => {
      handles.length = 0;
    };
  }, [enabled]);
}

function Divider({ src, className = "" }) {
  return <img className={`section-divider ${className}`.trim()} src={src} alt="" aria-hidden="true" loading="eager" decoding="async" fetchPriority="high" />;
}

function DressDetailsTransition() {
  return (
    <section className="transition-strip dress-details-transition" aria-hidden="true">
      <span className="transition-fill" />
      <img className="transition-image transition-dress-details" src={ASSETS.tornGreenTop} alt="" loading="eager" decoding="async" fetchPriority="high" />
    </section>
  );
}

function DetailsRsvpTransition() {
  return (
    <section className="transition-strip details-rsvp-transition" aria-hidden="true">
      <img className="transition-shadow transition-rsvp-shadow" src={ASSETS.shadowPalm} alt="" loading="eager" decoding="async" fetchPriority="high" />
      <img className="transition-image transition-details-rsvp" src={ASSETS.rsvpTorn} alt="" loading="eager" decoding="async" fetchPriority="high" />
    </section>
  );
}

function LeafTransition({ className = "", rotated = false, cream = false }) {
  return (
    <section className={`transition-strip leaf-transition ${cream ? "transition-cream" : ""} ${className}`.trim()} aria-hidden="true">
      {cream && <span className="transition-fill" />}
      <img
        className={`transition-image transition-leaf ${rotated ? "is-rotated" : ""}`.trim()}
        src={ASSETS.leafStrip}
        alt=""
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </section>
  );
}

function RsvpChatTransition() {
  return (
    <section className="transition-strip rsvp-chat-transition" aria-hidden="true">
      <img className="transition-image transition-rsvp-chat" src={ASSETS.tornCreamLarge} alt="" loading="eager" decoding="async" fetchPriority="high" />
    </section>
  );
}

function FinalCreamTransition() {
  return (
    <section className="transition-strip final-cream-transition" aria-hidden="true">
      <span className="transition-final-fill" />
      <img className="transition-image transition-final-cream" src={ASSETS.tornCreamLarge} alt="" loading="eager" decoding="async" fetchPriority="high" />
    </section>
  );
}

function Intro({ phase, onOpen }) {
  const envelopeOpened = phase !== "closed";

  return (
    <section className="intro" aria-label="Первый экран приглашения">
      <div className="intro-art">
        <div className="intro-card" aria-hidden={!envelopeOpened}>
          <img className="scene-bg" src={ASSETS.meadow} alt="" loading="eager" decoding="async" fetchPriority="high" />
          <img className="photo photo-maria" src={ASSETS.photoAlexey} alt="" loading="eager" decoding="async" fetchPriority="high" />
          <img className="photo photo-alexey" src={ASSETS.photoMaria} alt="" loading="eager" decoding="async" fetchPriority="high" />
          <p className="caption caption-left">— интересно, кто будет моей<br />женой, когда я вырасту?</p>
          <p className="caption caption-right">— ей буду я ❤</p>
          <img className="names-mark" src={ASSETS.names} alt="Дарья Даниил" loading="eager" decoding="async" fetchPriority="high" />
          <img className="tiny-star" src={ASSETS.star} alt="" loading="eager" decoding="async" data-scroll-motion="spin" />
        </div>

        <div className="intro-envelope" aria-hidden="true">
          <div className="side-hand side-hand-left" />
          <div className="side-hand side-hand-right" />
          <div className="cover"></div>
          <img className="bottom-flap" src={ASSETS.bottomFlap} alt="" loading="eager" decoding="async" fetchPriority="high" />
          <img className="top-flap" src={ASSETS.topFlap} alt="" loading="eager" decoding="async" fetchPriority="high" />
        </div>

        <h1 className="cover-title">ПРИГЛАШЕНИЕ<br />НА СВАДЬБУ</h1>
        <p className="open-copy">нажмите,<br />чтобы открыть</p>
        <button
          className="seal-hit"
          type="button"
          aria-label="Открыть приглашение"
          onClick={onOpen}
          disabled={phase !== "closed"}
        />
      </div>
    </section>
  );
}

function DearSection() {
  return (
    <section id="odinstart" className="invite-section section-green dear-section reveal">
      <div className="dear-stage" aria-hidden="true">
        <img src={ASSETS.starAlt} alt="" className="dear-star" loading="eager" decoding="async" data-scroll-motion="spin" />
        <img src={ASSETS.glassLeft} alt="" className="dear-glass dear-glass-left" loading="eager" decoding="async" fetchPriority="high" data-scroll-motion="dear-left" />
        <img src={ASSETS.glassRight} alt="" className="dear-glass dear-glass-right" loading="eager" decoding="async" fetchPriority="high" data-scroll-motion="dear-right" />
      </div>
      <div className="section-inner dear-copy-group">
        <p className="section-script">Дорогие</p>
        <h2 className="section-title section-title-wide">ДРУЗЬЯ</h2>
        <p className="section-copy">
          Мы рады поделиться с вами особенным событием — совсем скоро мы станем семьёй!
          В этот день нам очень хочется собрать рядом тех, с кем хочется разделить радость,
          улыбки, волнение и самые тёплые моменты нашего праздника.
        </p>
      </div>
    </section>
  );
}

function AugustSection() {
  return (
    <section className="invite-section section-cream august-section reveal">
      <Divider src={ASSETS.tornGreenTop} className="divider-top divider-top-green" />
      <img src={ASSETS.augustBranch} alt="" className="august-branch" loading="eager" decoding="async" />
      <div className="section-inner">
        <img src={ASSETS.clinkDark} alt="" className="august-arrow august-arrow-mini" loading="eager" decoding="async" />
        <img src={ASSETS.augustLine} alt="" className="august-line" loading="eager" decoding="async" />
        <img src={ASSETS.augustFlowers} alt="" className="august-wood" loading="eager" decoding="async" data-scroll-motion="drift-left" />

        <p className="section-script section-script-dark">Наш</p>
        <h2 className="section-title section-title-dark">ИЮЛЬ</h2>

        <div className="august-days" aria-hidden="true">
          {AUGUST_DAYS.map((day, index) => (
            day === "18" ? (
              <span key={day} className="august-day august-day-heart">
                <img src={ASSETS.augustHeart} alt="" loading="eager" decoding="async" />
                <span>{day}</span>
              </span>
            ) : (
              <span key={day} className={`august-day august-day-${index + 1}`}>
                {day}
              </span>
            )
          ))}
        </div>

        <div className="august-program">
          <div className="august-timeline">
            {AUGUST_ITEMS.map((item, index) => (
              <div
                className="august-event reveal reveal-left"
                key={item.time + item.label}
                style={{ "--reveal-delay": `${120 + index * 110}ms` }}
              >
                <span className="august-stem" aria-hidden="true" />
                <div className="august-event-copy">
                  <span className="august-time">{item.time}</span>
                  <span className="august-label">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Divider src={ASSETS.tornGreenLarge} className="divider-bottom" />
    </section>
  );
}

function LocationSection() {
  return (
    <section className="invite-section section-green location-section reveal">
      <Divider src={ASSETS.tornCreamLarge} className="divider-top location-torn-top" />
      <div className="section-inner">
        <img src={ASSETS.clinkLight} alt="" className="location-arrow location-arrow-one" loading="eager" decoding="async" data-scroll-motion="slide-right" />
        <img src={ASSETS.clinkLight} alt="" className="location-arrow location-arrow-two" loading="eager" decoding="async" data-scroll-motion="slide-left" />
        <img src={ASSETS.clinkLight} alt="" className="location-arrow location-arrow-three" loading="eager" decoding="async" data-scroll-motion="slide-right" />
        <img src={ASSETS.clinkLight} alt="" className="location-arrow location-arrow-four" loading="eager" decoding="async" data-scroll-motion="slide-left" />
        <h2 className="mega-title">LOCA<br />TION</h2>

        <div className="location-block location-combined reveal reveal-up" style={{ "--reveal-delay": "80ms" }}>
          <h3>Регистрация<br />и банкет</h3>
          <p>Белый причал<br />деревня Михалево</p>
          <img src={ASSETS.locationBeliyPrichal} alt="" className="location-photo location-photo-combined" loading="eager" decoding="async" data-scroll-motion="drift-left" />
          <a className="location-map-button" href="https://yandex.ru/maps/?text=%D0%91%D0%B5%D0%BB%D1%8B%D0%B9%20%D0%BF%D1%80%D0%B8%D1%87%D0%B0%D0%BB%20%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D0%BD%D1%8F%20%D0%9C%D0%B8%D1%85%D0%B0%D0%BB%D0%B5%D0%B2%D0%BE" target="_blank" rel="noreferrer">
            посмотреть на карте
          </a>
        </div>
      </div>
    </section>
  );
}

function DressCodeSection() {
  return (
    <section className="invite-section section-cream dress-section reveal">
      <Divider src={ASSETS.tornCreamTop} className="divider-top" />
      <div className="section-inner dress-inner">
        <img src={ASSETS.dressBranchLeft} alt="" className="dress-branch dress-branch-left" loading="eager" decoding="async" data-scroll-motion="drift-right" />
        <img src={ASSETS.dressBranchRight} alt="" className="dress-branch dress-branch-right" loading="eager" decoding="async" data-scroll-motion="drift-left" />
        {SILK_SWATCHES.map((item) => (
          <img key={item.className} src={item.src} alt="" className={item.className} loading="eager" decoding="async" />
        ))}

        <p className="futura-kicker">code</p>
        <h2 className="section-title section-title-dark">dress</h2>
        <p className="section-copy section-copy-dark">
          Мы хотим сделать праздник красивым и будем безумно рады, если Вы поддержите цветовую
          гамму нашей свадьбы.
        </p>

      </div>
    </section>
  );
}

function DetailsSection() {
  return (
    <section className="invite-section section-green details-section reveal">
      <div className="section-inner">
        <img src={ASSETS.starAlt} alt="" className="details-star" loading="eager" decoding="async" data-scroll-motion="spin" />
        <img src={ASSETS.dressBranchRight} alt="" className="details-branch" loading="eager" decoding="async" data-scroll-motion="drift-left" />
        <h2 className="mega-title details-title">Details</h2>
        <div className="details-list">
          {DETAILS_NOTES.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function RsvpForm() {
  const [attendance, setAttendance] = useState("yes");
  const [name, setName] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [submitState, setSubmitState] = useState("idle");
  const [statusText, setStatusText] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedGuestCount = guestCount.trim();

    if (!trimmedName || !trimmedGuestCount) {
      setSubmitState("error");
      setStatusText("Укажите имя и количество гостей.");
      return;
    }

    setSubmitState("submitting");
    setStatusText("Отправляем ответ...");

    try {
      await sendRsvpToTelegram({
        name: trimmedName,
        guestCount: trimmedGuestCount,
        attendance,
      });
      setSubmitState("success");
      setStatusText("Спасибо, ответ отправлен.");
    } catch (error) {
      setSubmitState("error");
      setStatusText("Telegram-отправка еще не настроена. Откройте бота @srm_list_bot.");
    }
  }

  return (
    <section className="invite-section section-cream rsvp-section reveal">
      <img src={ASSETS.shadowPalm} alt="" className="rsvp-shadow" loading="eager" decoding="async" />
      <div className="section-inner">
        <p className="mega-title rsvp-title">анкета</p>
        <p className="section-copy section-copy-dark rsvp-copy">
          Будем очень признательны, если вы сообщите нам о своем решении до 07.07.2026
        </p>

        <form className="rsvp-form" onSubmit={handleSubmit}>
          <div className="segmented" role="group" aria-label="Присутствие">
            <button
              type="button"
              className={attendance === "yes" ? "active" : ""}
              onClick={() => setAttendance("yes")}
            >
              Обязательно приду
            </button>
            <button
              type="button"
              className={attendance === "no" ? "active" : ""}
              onClick={() => setAttendance("no")}
            >
              Не смогу
            </button>
          </div>

          <label>
            <span>Ваше имя и фамилия</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Анна и Дмитрий Смирновы"
            />
          </label>

          <label>
            <span>Сколько вас будет человек?</span>
            <input
              type="number"
              min="1"
              inputMode="numeric"
              value={guestCount}
              onChange={(event) => setGuestCount(event.target.value)}
              placeholder="2"
            />
          </label>

          <button className="submit-button" type="submit" disabled={submitState === "submitting"}>
            {submitState === "submitting" ? "Отправляем..." : "Отправить"}
          </button>
          {statusText && (
            <p className={submitState === "success" ? "form-status ok" : "form-status"}>
              {statusText}
              {submitState === "error" && statusText.includes("Telegram") && (
                <>
                  {" "}
                  <a href={TELEGRAM_BOT_URL} target="_blank" rel="noreferrer">Открыть</a>
                </>
              )}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function GuestChatSection() {
  return (
    <section className="invite-section section-green chat-section reveal">
      <div className="section-inner">
        <img src={ASSETS.chatLeaf} alt="" className="chat-leaf" loading="eager" decoding="async" data-scroll-motion="drift-right" />
        <h2 className="mega-title chat-title">Чат для<br />гостей</h2>
        <p className="section-copy chat-copy">
          Предлагаем вступить в чат гостей, здесь можно обмениваться фото и видео со свадьбы
        </p>
        <div className="chat-phone-wrap" data-scroll-motion="drift-left">
          <img src={ASSETS.chatLeaf} alt="" className="chat-phone-branch chat-phone-branch-left" loading="eager" decoding="async" />
          <img src={ASSETS.chatLeaf} alt="" className="chat-phone-branch chat-phone-branch-right" loading="eager" decoding="async" />
          <a href={TELEGRAM_CHAT_URL} target="_blank" rel="noreferrer" className="chat-phone-link" aria-label="Открыть чат гостей в Telegram">
            <img src={ASSETS.guestPhone} alt="" className="chat-phone" loading="eager" decoding="async" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactsSection() {
  return (
    <section className="invite-section section-cream contacts-section reveal">
      <div className="section-inner">
        <h2 className="mega-title contacts-title">contacts</h2>
        <p className="section-copy section-copy-dark">
          По всем вопросам, связанным с мероприятием, вы можете связаться с нами:
        </p>

        <div className="contacts-stack">
          <div className="contact-card">
            <p>Жених Даниил</p>
            <a href="tel:+79999701909" className="contact-button">позвонить</a>
          </div>
          <div className="contact-card">
            <p>Невеста Дарья</p>
            <a href="tel:+79151150071" className="contact-button">позвонить</a>
          </div>
          <div className="contact-card">
            <p>Ведущий Денис</p>
            <a href="tel:+79022166374" className="contact-button">позвонить</a>
          </div>
        </div>

        <img src={ASSETS.contactsRock} alt="" className="contacts-rock" loading="eager" decoding="async" data-scroll-motion="drift-left" />
      </div>
    </section>
  );
}

function Countdown() {
  const time = useCountdown();
  const items = [
    ["days", "дней"],
    ["hours", "часов"],
    ["minutes", "минут"],
    ["seconds", "секунд"],
  ];

  return (
    <section className="invite-section section-green countdown-section reveal">
      <div className="section-inner">
        <h2 className="countdown-title">ДО СВАДЬБЫ<br />ОСТАЛОСЬ</h2>
        <div className="countdown-grid" aria-live="polite">
          {items.map(([key, label]) => (
            <div className="countdown-item" key={key}>
              <span className="countdown-number">{String(time[key]).padStart(2, "0")}</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section className="invite-section section-cream closing-section reveal">
      <div className="section-inner closing-inner">
        <p className="closing-caption reveal reveal-left" style={{ "--reveal-delay": "80ms" }}>С любовью,</p>
        <div className="closing-card reveal reveal-up" style={{ "--reveal-delay": "140ms" }}>
          <img src={ASSETS.closingPhoto} alt="Даниил и Дарья" loading="eager" decoding="async" />
          <p>До скорой встречи! ❤</p>
        </div>
        <p className="closing-sign reveal reveal-up" style={{ "--reveal-delay": "200ms" }}>Даниил & Дарья</p>
      </div>
    </section>
  );
}

export default function App() {
  const [phase, setPhase] = useState("closed");
  const musicRef = useRef(null);
  const isOpened = phase === "opened";
  useRevealOnScroll(isOpened);
  useScrollMotion(isOpened);
  useImagePreloader(phase !== "closed");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (phase !== "opening") {
      return undefined;
    }

    const timer = window.setTimeout(() => setPhase("opened"), ENVELOPE_OPEN_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    const shouldLock = phase !== "opened";
    document.documentElement.classList.toggle("scroll-locked", shouldLock);
    document.body.classList.toggle("scroll-locked", shouldLock);

    return () => {
      document.documentElement.classList.remove("scroll-locked");
      document.body.classList.remove("scroll-locked");
    };
  }, [phase]);

  function playMusicFromEightSeconds() {
    const music = musicRef.current;
    if (!music) {
      return;
    }

    const play = () => {
      music.currentTime = 8;
      music.volume = 0.75;
      music.play().catch(() => undefined);
    };

    if (music.readyState >= 1) {
      play();
      return;
    }

    music.addEventListener("loadedmetadata", play, { once: true });
    music.load();
  }

  function handleOpen() {
    if (phase !== "closed") {
      return;
    }

    playMusicFromEightSeconds();
    setPhase("opening");
  }

  return (
    <main className={`app phase-${phase}`}>
      <audio ref={musicRef} src={ASSETS.weddingMusic} preload="auto" />
      <div className="page-shell">
        <Intro phase={phase} onOpen={handleOpen} />
        <DearSection />
        <AugustSection />
        <LocationSection />
        <DressCodeSection />
        <DressDetailsTransition />
        <DetailsSection />
        <DetailsRsvpTransition />
        <RsvpForm />
        <RsvpChatTransition />
        <GuestChatSection />
        <LeafTransition className="chat-contacts-transition" cream rotated />
        <ContactsSection />
        <LeafTransition className="contacts-countdown-transition" cream />
        <Countdown />
        <FinalCreamTransition />
        <ClosingSection />
      </div>
    </main>
  );
}
