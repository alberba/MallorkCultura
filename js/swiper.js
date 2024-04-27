function activarSwipersImagenes() {
  // @ts-ignore
  let swiper = new Swiper(".mySwiper", {
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

function activarExposicionSwiper() {
  // @ts-ignore
  let exposicionSwiper = new Swiper(".exposiciones", {
    slidesPerView: "auto",
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}