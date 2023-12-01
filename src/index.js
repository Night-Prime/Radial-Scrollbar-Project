import Scrollbar from "smooth-scrollbar";
import { gsap, Power1 } from "gsap";
import { IMG } from "./data";
import { ModalPlugin } from "../plugin/scroll-plugin";
import { ScrollTrigger } from "gsap/all";

const constants = {
  SIZES: {
    MENU: {
      X: 5,
      Y: 40,
    },
  },
};

/**
 * @summary Setting up the functionalities of the Web Animations
 * from the radial scroll bar to the horizontal-scrolling.
 */

window.addEventListener("load", () => {
  const content = document.querySelector(".content");
  const scrollbar = document.querySelector(".scrollbar");
  const navContainer = [].slice.call(document.querySelectorAll(".nav > li"));
  const scrollMenu = document.querySelector(".scroll-menu");
  const side = document.querySelector(".side");
  const subMain = document.querySelector(".sub-main");

  Scrollbar.use(ModalPlugin);

  // configuring the Scrollbar for image-section
  const newScroll = Scrollbar.init(content, {
    damping: 0.1,
    delegateTo: document.querySelector(".scroll-content"),
  });

  newScroll.setPosition(0, 0);
  newScroll.track.yAxis.element.remove();
  newScroll.track.xAxis.element.remove();

  // disabling scroll initially
  newScroll.updatePluginOptions("modal", { open: true });

  // imitating a curve kind-of scroll
  newScroll.addListener(({ offset }) => {
    const { clientHeight, scrollHeight } = newScroll.containerEl;
    const progress = Number.parseInt(
      ((offset.y / (scrollHeight - clientHeight)) * 360).toFixed(0),
      10
    );
    const rotatePercentage = ((progress * (333 - 225)) / 360 + 225).toFixed(0);

    gsap.to(scrollbar, {
      transform: `rotate(${rotatePercentage}deg)`,
    });
  });

  // initialise interactions on load
  const initMenu = () => {
    const { X, Y } = constants.SIZES.MENU;
    gsap.to(scrollMenu, {
      delay: 0.8,
      autoAlpha: 1,
      ease: Power1.easeOut,
    });
    navContainer.forEach((navItem, index) => {
      const tl = gsap.timeline();

      tl.to(navItem, {
        transform: `translate( -${X * index}px, ${Y * index}px)`,
        duration: 0,
      })
        .to(navItem, {
          stagger: 0.2,
          delay: 0.8,
          autoAlpha: 1,
          ease: Power1.easeOut,
        })
        // enable the scroll after the GSAP loads
        .then(() => newScroll.updatePluginOptions("modal", { open: false }));

      /* when you click the links on the nav, 
       it should scroll to the first indexed image 
       of that collection. */
      navItem.addEventListener("click", () => {
        const scrollContent = [].slice.call(
          document.querySelector(".scroll-content").querySelectorAll(".item")
        );
        console.log(scrollContent);

        const scrollItem = scrollContent.find(
          ({ dataset }) => dataset.id === navItem.dataset.id
        );

        onMenuSelect(navItem);
        newScroll.scrollIntoView(scrollItem, {
          onlyScrollIfNeeded: true,
        });
      });
    });

    onMenuSelect(navContainer[0]);
  };

  const onMenuSelect = (selectedItem) => {
    // Destructuring assignment to extract values from constants.SIZES.MENU
    const { X, Y } = constants.SIZES.MENU;

    // Toggle the active state of the selected menu item
    toggleActive(selectedItem);

    // Loop through each item in the navContainer array using entries() method
    for (const [i, navItem] of navContainer.entries()) {
      // Extract the numeric id from the selected item's data-id attribute
      const id = Number.parseInt(selectedItem.dataset.id, 10);

      // Calculate the index (position) of the current item in the loop
      const index = i + 1;

      // Get the current Y position of the current and selected items using GSAP's getProperty
      const currentItemYPos = gsap.getProperty(navItem, "translateY");
      const selectedItemYPos = gsap.getProperty(selectedItem, "translateY");

      // Calculate the translation steps and value based on the selected item's position
      const translateSteps = selectedItemYPos / Y;
      const translateValue = translateSteps * Y;

      // Use GSAP to animate the transform property of the current item
      gsap.to(navItem, {
        transform: `translate(
        ${index < id ? -(X * (id - index)) : X * (id - index)}px, 
        ${currentItemYPos - translateValue}px
      )`,
        duration: 0.8,
        ease: Power1.easeOut,
      });
    }
  };

  // toggling states
  const toggleActive = (item) => {
    navContainer.forEach((n) => {
      if (n.dataset.id === item.dataset.id) {
        item.classList.add("active");
      } else {
        n.classList.remove("active");
      }
    });
  };

  // Generating the images list
  const generateIMGList = () => {
    const scrollContent = document.querySelector(".scroll-content");
    // iterates over the list of images
    IMG.forEach((item) => scrollContent.appendChild(createImg(item)));
    // adds a class on each of the image
    scrollContent.classList.add(IMG.length % 2 === 0 ? "even" : "odd");
    // applying GSAP Properties on the images (avoiding FOUC)
    if (scrollContent.children.length === IMG.length) {
      gsap.to(scrollContent, {
        autoAlpha: 1,
        delay: 1,
      });
    }
  };
  // creates & arrange the DOM styling & structure for each image
  const createImg = (item) => {
    const imgContainer = document.createElement("div");
    const heading = document.createElement("div");
    const title = document.createElement("div");
    const order = document.createElement("span");
    const image = document.createElement("div");
    const img = document.createElement("img");

    // Attach classes
    imgContainer.classList.add("item");
    heading.classList.add("heading");
    title.classList.add("title");
    order.classList.add("order");
    image.classList.add("picture");

    // Check if each item has imgUrl property & seeting a general style
    if (item.imgUrl) {
      img.src = item.imgUrl;
      image.appendChild(img);
      img.height = 369;
      img.width = 596;
      img.style.objectFit = "cover";
    }

    title.textContent = item.title;
    order.textContent = item.id;

    heading.appendChild(title);
    heading.appendChild(order);
    imgContainer.appendChild(heading);
    imgContainer.appendChild(image);

    if (item.hasOwnProperty("navId")) {
      imgContainer.setAttribute("data-id", item.navId);
    }

    return imgContainer;
  };

  // Add Image to the inner-content class
  // const addIMG = async () => {
  //   const subMain = document.querySelector(".sub-main");
  //   const imageScroll = document.createElement("div");
  //   const inner = document.createElement("div");
  //   const overlay = document.createElement("div");

  //   Scrollbar.init(subMain, {
  //     damping: 0.1,
  //     delegateTo: document.querySelector(".sub-main"),
  //   });

  //   inner.classList.add("container");
  //   imageScroll.classList.add("image-scroll");
  //   overlay.classList.add("overlay-content");
  //   overlay.classList.add("overlay-2");

  //   subMain.appendChild(imageScroll);
  //   imageScroll.appendChild(overlay);
  //   overlay.appendChild(inner);

  //   // Exclude the first photo from the IMG array
  //   const photosToDisplay = IMG.slice(1);

  //   // Preload images
  //   await Promise.all(
  //     photosToDisplay.map((photo) => {
  //       return new Promise((resolve) => {
  //         const img = new Image();
  //         img.src = photo.imgUrl;
  //         img.onload = resolve;
  //         img.loading = "eager";
  //       });
  //     })
  //   );

  //   photosToDisplay.forEach((photo) => {
  //     const content = document.createElement("div");
  //     const image = document.createElement("img");

  //     image.classList.add("image");
  //     content.classList.add("image-container");

  //     // Set the image source from the photo object
  //     image.src = photo.imgUrl;
  //     image.style.objectFit = "cover";

  //     content.appendChild(image);
  //     inner.appendChild(content);

  //     // handle animation on load
  //     gsap.to(image, {
  //       stagger: 0.1,
  //       delay: 0.1,
  //       autoAlpha: 1,
  //       ease: Power1.easeOut,
  //     });
  //   });
  //   console.log(subMain);
  // };

  const animateList = () => {
    gsap.fromTo(
      side.children,
      {
        opacity: 0,
      },
      {
        stagger: 0.15,
        delay: 0.5,
        y: 0,
        autoAlpha: 1,
        opacity: 1,
      }
    );
  };

  initMenu();
  generateIMGList();
  animateList();
  addIMG();

  // implementing Intersection Observer
  let options = {
    root: newScroll.containerEl,
    rootMargin: "0px",
    threshold: 0.5,
  };

  let observer = new IntersectionObserver((entries, _) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const selection = navContainer.find(
          ({ dataset }) => dataset.id === entry.target.dataset.id
        );

        if (Boolean(selection)) {
          onMenuSelect(selection);
        }
      }
    });
  }, options);

  newScroll.containerEl.querySelectorAll(".item").forEach((p) => {
    observer.observe(p);
  });
});
