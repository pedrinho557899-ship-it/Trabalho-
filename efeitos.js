const slides = Array.from(document.querySelectorAll(".slide"));
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const slideFragments = slides.map((slide) =>
  Array.from(slide.querySelectorAll(".fragment"))
);

let current = 0;
let step = 0;

function fragmentsFor(slide) {
  return slideFragments[slides.indexOf(slide)] || [];
}

function paintFragments(slide) {
  fragmentsFor(slide).forEach((fragment, index) => {
    fragment.classList.toggle("visible", index <= step);
  });
}

function resetSlide(slide) {
  fragmentsFor(slide).forEach((fragment) => {
    fragment.classList.remove("visible");
  });
}

function showSlide(index) {
  const previousSlide = slides[current];

  current = Math.max(0, Math.min(index, slides.length - 1));
  step = 0;

  if (previousSlide && previousSlide !== slides[current]) {
    resetSlide(previousSlide);
    previousSlide.classList.remove("active");
  }

  slides[current].classList.add("active");

  paintFragments(slides[current]);
  updateButtons();
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
    const previousSlide = slides[current];
    current -= 1;
    step = Math.max(0, fragmentsFor(slides[current]).length - 1);

    resetSlide(previousSlide);
    previousSlide.classList.remove("active");
    slides[current].classList.add("active");

    paintFragments(slides[current]);
    updateButtons();
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

showSlide(0);
