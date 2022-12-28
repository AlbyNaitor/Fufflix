function getVideoList() {
   attivaLoader("video");

   $.get("https://fufflix.vallauri-unofficial.workers.dev/courses-list")
      .done((videoList) => {
         window.localStorage.setItem("videoList", JSON.stringify(videoList));
         createVideoGrid();
      })
      .fail((e) => {
         alertPersonalizzato(
            "Errore durante la ricezione dei dati",
            "Codice di errore: " + e.status
         );

         $("#video").html(`
            <div onclick="getVideoList()" id="reloadButton">
               <i class="fa-solid fa-rotate-right"></i>
               <p>Riprova</p>
            </div>
         `);
      });
}

function createVideoGrid(excludedVideo = null) {
   const video = $("#video");
   const videoList = JSON.parse(window.localStorage.getItem("videoList"));

   videoList.forEach((item) => {
      if (item.id != excludedVideo)
         video.append(
            `
            <div class="col-lg" style="padding: 15px; display: flex; justify-content: center">
               <div class="card videoCard" onclick="openVideo('${item.id}')">
                  <img src="../img/fufflix-logo-full.png" class="card-img-top" alt="fufflix logo">
                  <div class="card-body">
                     <h5 class="card-title">${item.name}</h5>
                     <p class="card-text">👀 ${item.watchers}</p>
                  </div>
               </div>
            </div>
         `
         );
   });

   video.removeClass("centrato");
   video.addClass("griglia row");
}

function openVideo(id) {
   window.localStorage.setItem("watchVideoId", id);
   window.location.href = "../html/video.html";
}

function loadVideoPage() {
   const id = window.localStorage.getItem("watchVideoId");

   $("#video").html("");
   createVideoGrid(id);
   attivaLoader("cardVideoPlayer");

   $.get(
      "https://fufflix.vallauri-unofficial.workers.dev/courses?course_id=" + id
   )
      .done((video) => {
         visualizzaVideo(video);
      })
      .fail((e) => {
         alertPersonalizzato(
            "Errore durante la ricezione dei dati",
            "Codice di errore: " + e.status
         );

         $("#cardVideoPlayer").html(`
            <div onclick="loadVideoPage()" id="reloadButton">
               <i class="fa-solid fa-rotate-right"></i>
               <p>Riprova</p>
            </div>
         `);
      });
}

function visualizzaVideo(video) {
   $("#cardVideoPlayer").html(
      `
      <video id="videoPlayer" controls>
      </video>
      <div class="card-body">
         <h3 class="card-title" id="videoTitle"></h3>
         <p class="card-text" id="videoWatchers"></p>
      </div>
      `
   );

   $("#videoTitle").text(video.name);
   $("#videoWatchers").text("Active watchers 👀 : " + video.watchers);
   $("#videoPlayer").html(
      `
               <source src="${video.video_url}" type="video/mp4">
            `
   );
}

function alertPersonalizzato(title, body) {
   document.getElementById("exampleModalLabel").innerText = title;
   document.getElementById("modalBody").innerText = body;
   document.getElementById("btnModale").click();
}

function attivaLoader(id) {
   const video = $("#" + id);

   video.addClass("centrato");
   video.removeClass("griglia row");

   video.html(`   
      <svg id="loader" class="pl" viewBox="0 0 128 128" width="128px" height="128px" xmlns="http://www.w3.org/2000/svg">
         <defs>
            <linearGradient id="pl-grad" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stop-color="hsl(337, 88%, 51%)" />
               <stop offset="100%" stop-color="hsl(23, 99%, 51%)" />
            </linearGradient>
         </defs>
         <circle class="pl__ring" r="56" cx="64" cy="64" fill="none" stroke="hsla(0,10%,10%,0.1)" stroke-width="16"
            stroke-linecap="round" />
         <path class="pl__worm"
            d="M92,15.492S78.194,4.967,66.743,16.887c-17.231,17.938-28.26,96.974-28.26,96.974L119.85,59.892l-99-31.588,57.528,89.832L97.8,19.349,13.636,88.51l89.012,16.015S81.908,38.332,66.1,22.337C50.114,6.156,36,15.492,36,15.492a56,56,0,1,0,56,0Z"
            fill="none" stroke="url(#pl-grad)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"
            stroke-dasharray="44 1111" stroke-dashoffset="10" />
      </svg>
   `);
}
