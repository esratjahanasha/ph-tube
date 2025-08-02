function getTimeString(time) {
  //get hours and rest seconds
  const hour = parseInt(time / 3600);
  let remainingsecond = time % 3600;
  const minute = parseInt(remainingsecond / 60);
  remainingsecond = minute % 60;
  return `${hour} hour ${minute} minute ${remainingsecond} second ago`;
}
const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  for (const button of buttons) {
    button.classList.remove("active");
  }
};

/* fetch,load and show categories on html*/
// create loadcategories
const loadcategories = () => {
  //fetch the data
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};
// create loadVideos
const loadVideos = (searchText = "") => {
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error));
};

/*// const demo={
//     "category_id": "1001",
//     "video_id": "aaaa",
//     "thumbnail": "https://i.ibb.co/L1b6xSq/shape.jpg",
//     "title": "Shape of You",
//     "authors": [
//         {
//             "profile_picture": "https://i.ibb.co/D9wWRM6/olivia.jpg",
//             "profile_name": "Olivia Mitchell",
//             "verified": ""
//         }
//     ],
//     "others": {
//         "views": "100K",
//         "posted_date": "16278"
//     },
//     "description": "Dive into the rhythm of 'Shape of You,' a captivating track that blends pop sensibilities with vibrant beats. Created by Olivia Mitchell, this song has already gained 100K views since its release. With its infectious melody and heartfelt lyrics, 'Shape of You' is perfect for fans looking for an uplifting musical experience. Let the music take over as Olivia's vocal prowess and unique style create a memorable listening journey."
// }*/

//create loadCategoryVideos
const loadCategoryVideos = (id) => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
    .then((data) => {
      //shob button theke active class remove korao
      removeActiveClass();
      //id k active class dew
      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add("active");
      displayVideos(data.category);
    })
    .catch((error) => console.log(error));
};
//create load video details
const loadDetails = async (videoId) => {
  // console.log(videoId);
  const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const res = await fetch(uri);
  const data = await res.json();
  displayDetails(data.video);
  // console.log(data)
};

//create displaydetails
const displayDetails = (video) => {
  // console.log(video)
  const detailContainer = document.getElementById("modal_content");
  detailContainer.innerHTML = `<img src="${video.thumbnail}" />
 <p>${video.description}</p>`;
  document.getElementById("customModal").showModal();
};
//create displaycategories
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("categories");
  //  console.log(categories);
  for (const item of categories) {
    // console.log(item);
    //create a button
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `<button onclick="loadCategoryVideos(${item.category_id})" id="btn-${item.category_id}" class="btn category-btn">${item.category}</button>`;
    //add button to category container
    categoryContainer.append(buttonContainer);

    //another option
    /*const button = document.createElement("button");
    button.classList.add("btn");
    button.innerText = item.category;
    //add button to category container
    categoryContainer.append(button);*/
  }
};
//create displayVideos
const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videos-container");
  videoContainer.innerHTML = "";
  if (videos.length == 0) {
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = `<div class="min-h-[300px] flex flex-col justify-center items-center gap-5"><img src="./assets/Icon.png">
     <h2 class="text-xl font-bold">Oops!! Sorry, There is no content here.</h2>
    </div>`;
    return;
  } else {
    videoContainer.classList.add("grid");
  }
  for (const video of videos) {
    // console.log(video);
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `<figure class="h-[200px] relative">
    <img class="w-full h-full object-cover"
      src=${video.thumbnail}/>
      ${
        video.others.posted_date?.length == 0
          ? ""
          : `<span class="absolute right-2 bottom-2 bg-black p-1 rounded text-white text-xs">${getTimeString(
              video.others.posted_date
            )}</span>` /*optional chaining*/
      }         
  </figure>
  <div class="px-0 py-2">
   <div><img class="w-10 h-10 rounded-full object-cover" src="${
     video.authors[0].profile_picture
   }" alt=""></div>
     <div>
     <h2 class="font-bold">${video.title}</h2>
     <div class="flex gap-2 items-center">
     <p class="text-gray-400">${video.authors[0].profile_name}</p>
   ${
     video.authors[0].verified === true
       ? '<img class="w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png" />'
       : ""
   }  
     </div>
       <p><button onclick="(loadDetails('${
         video.video_id
       }'))" class="btn btn-sm btn-error">details</button></p>
       </div>
  </div>`;
    videoContainer.append(card);
  }
};

document.getElementById("search-input").addEventListener("keyup", (event) => {
  loadVideos(event.target.value);
});
loadcategories();
loadVideos();
