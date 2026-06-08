const slides = Array.from(document.querySelectorAll(".slide"));
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");

let current = 0;
let step = 0;

function fragmentsFor(slide) {
  return Array.from(slide.querySelectorAll(".fragment"));
}

function paintFragments(slide) {
  fragmentsFor(slide).forEach((fragment, index) => {
    fragment.classList.toggle("visible", index <= step);
  });
}

function resetSlide(slide) {
  slide.querySelectorAll(".photo, .note").forEach((item) => {
    item.style.translate = "";
  });
  fragmentsFor(slide).forEach((fragment) => {
    fragment.classList.remove("visible");
  });
}

function showSlide(index) {
  current = Math.max(0, Math.min(index, slides.length - 1));
  step = 0;

  slides.forEach((slide, slideIndex) => {
    resetSlide(slide);
    slide.classList.toggle("active", slideIndex === current);
  });

  paintFragments(slides[current]);
  updateButtons();
  burst();
}

function updateButtons() {
  const fragments = fragmentsFor(slides[current]);
  prevButton.disabled = current === 0 && step === 0;
  nextButton.disabled = current === slides.length - 1 && step >= fragments.length - 1;
}

function nextStep() {
  const fragments = fragmentsFor(slides[current]);

  if (step < fragments.length - 1) {
    step += 1;
    paintFragments(slides[current]);
    updateButtons();
    burst();
    return;
  }

  showSlide(current + 1);
}

function previousStep() {
  if (step > 0) {
    step -= 1;
    paintFragments(slides[current]);
    updateButtons();
    return;
  }

  if (current > 0) {
    current -= 1;
    step = Math.max(0, fragmentsFor(slides[current]).length - 1);

    slides.forEach((slide, slideIndex) => {
      resetSlide(slide);
      slide.classList.toggle("active", slideIndex === current);
    });

    paintFragments(slides[current]);
    updateButtons();
  }
}

function addPointerMotion(event) {
  const activeSlide = slides[current];

  if (!activeSlide) return;

  const x = event.clientX / window.innerWidth - 0.5;
  const y = event.clientY / window.innerHeight - 0.5;

  activeSlide.querySelectorAll(".photo, .note").forEach((item, itemIndex) => {
    const strength = itemIndex % 2 === 0 ? 15 : -11;
    item.style.translate = `${x * strength}px ${y * strength}px`;
  });
}

function burst() {
  const amount = 10;

  for (let index = 0; index < amount; index += 1) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.left = `${window.innerWidth - 90 + Math.random() * 42}px`;
    spark.style.top = `${window.innerHeight - 70 + Math.random() * 26}px`;
    spark.style.animationDelay = `${Math.random() * 0.18}s`;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 1200);
  }
}

prevButton.addEventListener("click", previousStep);
nextButton.addEventListener("click", nextStep);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") previousStep();
  if (event.key === "ArrowRight" || event.key === " ") nextStep();
  if (event.key === "Home") showSlide(0);
  if (event.key === "End") showSlide(slides.length - 1);
});

document.addEventListener("mousemove", addPointerMotion);

showSlide(0);
