'use strict';

const BASE_URL = 'https://api.tvmaze.com';
const DEFAULT_IMAGE = `https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300`;

const $showsList = $('#showsList');
const $episodesArea = $('#episodesArea');
const $searchForm = $('#searchForm');
const searchTerm = $searchForm.val();

// Class for each show in search result.
// Checks if image is null, sets default if true.
class Show {
  constructor(showCard) {
    this.id = showCard.id;
    this.name = showCard.name;
    this.summary = showCard.summary;
    this.image = this.imageCheck(showCard);
  }

  imageCheck(showCard) {
    if (showCard.image === null) {
      // console.log('image=', showCard.image.original);
      return DEFAULT_IMAGE;
    } else {
      return showCard.image.original;
    }
  }
}

// Class for each episode
// method GiveMeAListItem returns the raw HTML of a list item with episode information.
class Episode extends Show {
  constructor(showCard) {
    super(showCard);
    this.id = showCard.id;
    this.number = showCard.number;
    this.name = showCard.name;
    this.season = showCard.season;
  }
  giveMeAListItem() {
    return `<li>${this.name} (${this.season}, number ${this.number})</li>`;
  }
}

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  //send a get request to tvmaze with searchTerm as q parameters
  const searchResult = await axios.get(
    `${BASE_URL}/search/shows/?q=${searchTerm}`
  );

  const shows = searchResult.data;

  //TODO:ask about why this didnt work in CR
  //   method: "get",
  //   url: `${BASE_URL}/search/shows/?q=${searchTerm}`,
  //   type: 'application/json',
  //   //no headers
  //   // params: {
  //   //   q: `${searchTerm}`,
  //   // },
  // });

  // imageCheck(image) {
  //   if (image.original === null) {
  //     this.image = DEFAULT_IMAGE;
  //   } else {
  //     this.image = image.original;
  //   }
  // }

  //leaving these for now for further testing
  // console.log("search result=", searchResult);
  // console.log("ID", searchResult.data[0].show.id);
  // console.log("image", show.image.original);
  // console.log("name", searchResult.data[0].show.name);

  //format it per below

  // ADD: Remove placeholder & make request to TVMaze search shows API.

  let formattedShowData = [];

  //parse the API output into specified format
  for (let show of shows) {
    // console.log("show.show.image=", show.show.image);
    // const image = null;
    //TODO: what am I doing wrong that makes it show.show?
    // console.log('show=', show.show.image.original)
    const showCard = new Show(show.show);

    //   showCard.id = show.show.id;
    //   showCard.name = show.show.name;
    //   showCard.summary = show.show.summary || 'no summary available';
    //   showCard.image = show.show.image.original;

    formattedShowData.push(showCard);
    // }
  }
  return formattedShowData;

  // return [
  //   {
  //     id: searchResult.data[0].show.id,
  //     name: searchResult.data[0].show.name,
  //     summary: searchResult.data[0].show.summary,
  //     image: showImage,
  //   },
  // ];
}

/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  // console.log('shows=', shows);
  $showsList.empty();

  for (const show of shows) {
    // console.log('show=', show);
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="Show Poster"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button id="${show.id}" class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);

    //FIXME: I was attempting to pass the show ID directly through the function chain (Do not reccomend lol)
    // $('.Show-getEpisodes').on('click', handleEpisodeClick(show.id));
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $('#searchForm-term').val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

/**handles click on submit button and calls searchShowAndDisplay */
$searchForm.on('submit', async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});

//

//

//

//
/**
 * I tooled around for about an hour and got this far: some of it's ok but after looking at the solution I think there are some clear issues with the way I was trying to retrieve the showID and return the axios API request.
 *
 */

// /** getEpisodesOfShow() takes in the ID of a show and returns a promise array of episodes from tvmaze API.
//  */
// async function getEpisodesOfShow(id) {
//   const episodes = await axios.get(`${BASE_URL}/shows/${id}/episodes`);
//   console.log(episodes.data);
//   return episodes.data; // returns array of episode objects
// }

// /** displayEpisodes() takes in the episodes array promise from getEpisodesOfShow() and creates an instantiation of the class Episodes that is appended to the dom.
//  */
// function displayEpisodes(episodes) {
//   $episodesArea.empty();
//   const $episodesUl = $("<ul class='episodes'></ul>");
//   console.log(episodes);
//   for (const episode of episodes) {
//     let newLi = new Episode(episode).giveMeAListItem();
//     $episodesUl.append(newLi);
//   }
//   $episodesArea.append($episodesUl);
//   $episodesArea.style.display = 'swag';
// }

// // add other functions that will be useful / match our structure & design

// function handleEpisodeClick(id) {
//   const showId = id;
//   let allEpisodes = getEpisodesOfShow(showId);
//   displayEpisodes(allEpisodes);
//   $episodesArea.show();
//   // const episodeId = $('evt').val();
//   // const episodes = await getEpisodesOfShow(term);
// }

// /**
//  *  This function also makes the div visible by changing its jquery class.
//  */
// async function getAndDisplayEpisodes(id) {}
