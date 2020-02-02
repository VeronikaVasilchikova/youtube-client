document.addEventListener('DOMContentLoaded', () => {

	const form = document.forms[0];
	const input = form.elements[name="search"];
	const videosSlider = document.querySelector('.slider');
	const prevBtn = document.querySelector('.prev');
	const nextBtn = document.querySelector('.next');
	const container = document.querySelector('.container');

// create a function showAlert(err) to show error message in failed case
	function showAlert(err) {
		return err;
	}

	const SNIPPET = "&part=snippet&type=video&maxResults=15&order=viewCount&q=";
	const SEARCH_TARGET = "search";
	const KEY = '?key=AIzaSyBbk-dFPbVSB-j_wem_hGbk96EnPXF0PHA';
	const URL = "https://www.googleapis.com/youtube/v3/";

// create a function getData(query) to get data from youtube
	async function getData(query) {
		const result = await fetch(`${URL}${SEARCH_TARGET}${KEY}${SNIPPET}${query}`);
		if(!result.ok) {
			throw new Error(`status: ${result.status}`);
		}
		return await result.json();
	}

// add event to form submitting
	form.addEventListener('submit', function(e) {
		e.preventDefault();
		loadVideos();
		form.reset();
	});

// create a function loadVideos() to load videos depending on the request
	function loadVideos() {
		const query = input.value;
		getData(query)
			.then(data => {
				renderVideos(data.items);
			})
			.catch(err => showAlert(err, 'error-msg'));
	}

// create a function renderVideos(videos) to draw information about videos on the page
	function renderVideos(videos) {

		if(videosSlider.children.length) {
			clearSlider(videosSlider);
		}

		let fragment = '';
		videos.forEach(item => {

			const el = videoTemplate(item);
			fragment = el;
			videosSlider.insertAdjacentHTML('afterbegin', fragment);
		});

		prevBtn.classList.toggle('active');
		nextBtn.classList.toggle('active');
	}

// create a function clearSlider(slider) to clear slider after new request
	function clearSlider(slider) {
		let child = slider.lastElementChild;
		while(child) {
			slider.removeChild(child);
			child = slider.lastElementChild;
		}
		prevBtn.classList.remove('active');
		nextBtn.classList.remove('active');
	}

// create a function videoTemplate(object) to draw a card with one video
	function videoTemplate(object) {
		return `
		<div class="searchVideo">
			<img src="${object.snippet.thumbnails.medium.url}" class="top-image">
			<div class="title">
				<a href="https://www.youtube.com/watch?v=${object.id.videoId}" target="_blank">${object.snippet.title}</a>
			</div>
			<div class="channel-name">
				<img src="pictures/man.png">
				<p>${object.snippet.channelTitle}</p>
			</div>
			<div class="upload-date">
				<img src="pictures/calendar.png">
				<p>${(new Date(object.snippet.publishedAt)).toDateString()}</p>
			</div>
			<p>${object.snippet.description}</p>
		</div>
		`;
	}

	let width = 308;
	let count = 4;
	let position = 0;

	prevBtn.addEventListener('click', () => {
		position += width * count;
		position = Math.min(position, 0);
		videosSlider.style.marginLeft = position + 'px';
	});


	container.addEventListener('click', (e) => {
		if(e.target.classList.contains('next')) {
			let len = e.target.offsetParent.children[1].children[0].children.length;
			position -= width * count;
			position = Math.max(position, -width * (len - count));
			videosSlider.style.marginLeft = position + 'px';
		}
	});

});