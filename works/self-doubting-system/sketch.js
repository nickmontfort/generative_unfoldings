//lee2sman 2021
let params,
	seed,
	page,
	started = false,
	fadingIn = false,
	song,
	talk = [],
	frame = false,
	bw = true,
	roomTimer = 3000,
	colorTimer = 3000,
	player,
	roomObjs = [],
	npcObjs = [],
	roomImg = [],
	npcImg = [],
	totalSounds = 5,
	items = 21,
	currentItems,
	npcs = 17,
	currentNPCs,
	players = 22,
	playerImgs = [],
	title,
	titleWords = [
		"Birth",
		"Introduction",
		"Reveal",
		"Leaving",
		"Exiting",
		"Embarking",
		"Parting",
		"Delivery",
		"Donation",
		"Presentation",
		"Endowment",
		"Reveal",
		"Exposure",
		"Separation",
		"Death",
		"Abandonment",
		"Awakening",
		"Rise",
		"Improvement",
		"Learning",
		"Education",
		"Separation",
		"Removal",
		"Rejection",
		"Elimination",
		"Formal",
		"Practiced",
		"Routine",
		"Wounding",
		"Hurting",
		"Insulting",
		"Giving",
		"Departure",
		"Victory",
		"Trickery",
		"Involuntary"
	],
	events = [
		"Arrival",
		"Birth",
		"Introduction",
		"Reveal",
		"Departure",
		"Leaving",
		"Exiting",
		"Embarking",
		"Parting",
		"Giving",
		"Delivery",
		"Donation",
		"Presentation",
		"Endowment",
		"Receiving",
		"Acceptance",
		"Discovery",
		"Reveal",
		"Exposure",
		"Loss",
		"Separation",
		"Death",
		"Abandonment",
		"Deceit",
		"Trickery",
		"Con",
		"Fool",
		"Victory",
		"Success",
		"Overcoming",
		"Triumph",
		"Passage",
		"Defeat",
		"Fall",
		"Failure",
		"Reversal",
		"Enlightenment",
		"Awakening",
		"Rise",
		"Improvement",
		"Learning",
		"Education",
		"Initiation",
		"Acceptance",
		"Embracing",
		"Welcoming",
		"Joining",
		"Expulsion",
		"Separation",
		"Removal",
		"Rejection",
		"Elimination",
		"Ritual",
		"Ceremony",
		"Rite",
		"Process",
		"Injury",
		"Wounding",
		"Hurting",
		"Insulting",
		"Healing",
		"Improvement",
		"Mending",
		"Joining",
		"Rebirth",
		"Renewal",
		"Return"
	],
	talkTimer = 6000,
	talking = false,
	roomTimeout = 6000,
	timer = 3000,
	questNum,
	questions = [
		"What am I saying to myself?",
		"What triggers these feelings?",
		"What can I say differently to myself?",
		"How can I change my thoughts?",
		"How can I change my behavior?",
		"What can I do next?",
		"Does this cause problems for others?",
		"What could you do instead?",
		"What changed inside you?",
		"What beliefs did you adopt?",
		"In what ways would your life change?",
		"what is stopping you?",
		"What beliefs contribute to your frustration?",
		"How often does this happen?",
		"Are you fulfilled?",
		"What is the pattern?",
		"What can you learn about yourself?",
		"What are your primary beliefs?",
		"What would you do?",
		"How are you feeling about yourself?",
		"Is this something within your power to change?",
		"Are they positive or negative memories?",
		"ERR0R"
	],
	textX = 30,
	f,
	f2,
	overpass,
	roomText,
	fortune = [
		"If everything seems to be going well, you have obviously overlooked something.",
		"Neither spread the germs of gossip nor encourage others to do so.",
		"Them that has, gets",
		"If you see a bright streak in the sky coming at you, remove.",
		"In which level of metalanguage are you now speaking?",
		"Delusions are usually functional",
		"You too can wear a nose mitten.",
		"Brain off-line, please wait",
		"BAD CRAZINESS, MAN!"
	];

function preload() {
	for (let i = 0; i < items; i++) {
		roomImg[i] = loadImage("assets/background/" + i + ".jpg");
	}

	for (let i = 0; i < npcs; i++) {
		npcImg[i] = loadImage("assets/npc/" + i + ".png");
	}

	for (let i = 0; i < players; i++) {
		playerImgs[i] = loadImage("assets/char/" + i + ".png");
	}

	f = loadFont("assets/font/false.otf");
	f2 = loadFont("assets/font/DS-TERM.TTF");
	overpass = loadFont("assets/font/overpass-mono-bold.ttf");

	for (let i = 0; i < totalSounds; i++) {
		talk[i] = loadSound("assets/snd/talk" + i + ".mp3");
		talk[i].playMode("untilDone");
	}
}

function setup() {
	params = getURLParams();

	if (params.page) {
		createCanvas(4921, 7360); //resize for 300dpi!
		talking = true;
	} else {
    console.log('starting w: ', windowWidth)
    console.log('starting h: ', windowHeight)
		createCanvas(windowWidth, windowHeight);
	}

	processAPI();

	background(226, 226, 216);

	rectMode(CENTER);
	title =
		titleWords[floor(random(titleWords.length))] +
		" && " +
		titleWords[floor(random(titleWords.length))];

	initPlayer();
	initSprites();
	resetRoom();

	drawSprites();
}

function draw() {
	if (!started && !frame && !params.page && !params.seed) {
		startScreen();
	} else {
		main();
		detectSave();
	}
}

function main() {
	background(226, 226, 216);

	if (millis() > roomTimeout) {
		roomTimeout = millis() + random(8000, 14000);
		resetRoom();
	}

	playerController();

	drawItems();
	drawNPCs();

	drawSprite(player);
	checkForConvo();
	haveConvo();
	drawRoomText();

	colorChanger();
}

function mousePressed() {
	if (!started) {
		started = true;
	}
}

function startScreen() {
	image(roomImg[0], 0, 0, windowWidth, windowHeight);
	textFont(f2);

	if (windowWidth < 600) {
		background(0);
	}
	fill(0);
	strokeWeight(5);
	fill(255);
	rect(windowWidth / 2, windowHeight / 2, 110, 40);
	fill(0);
	textSize(30);
	textAlign(CENTER, CENTER);

	text("Play?", windowWidth / 2, windowHeight / 2);

	rect(windowWidth / 2, windowHeight / 4, windowWidth / 2, 60);
	//TITLE
	textSize(60);
	fill(226, 226, 216);
	text(title, windowWidth / 2, windowHeight / 4);
}

function processAPI() {
	if (params.seed && params.page) {
		//seed param
		seed = params.seed + params.page;

		randomSeed(seed);
	} else if (params.seed) {
		seed = params.seed;

		randomSeed(seed);
	} else {
		console.log("No parameter input. API to seed: ?seed=XX&page=XX");
	}
}

function initPlayer() {
	questNum = int(random(questions.length));
	player = createSprite(400, 200);
	playerImg = playerImgs[floor(random(players))];
	player.addImage(playerImg);

	//initial player velocity
	player.velocity.x = random(-5, 5);
	player.velocity.y = random(-5, 5);
}
function initSprites() {
	for (let i = 0; i < items; i++) {
		roomObjs[i] = createSprite(400, 200);
		roomObjs[i].addImage(roomImg[i]);
		roomObjs[i].position.x = random(windowWidth);
		roomObjs[i].position.y = random(windowHeight);
	}
	//create npcs
	for (let i = 0; i < npcs; i++) {
		npcObjs[i] = createSprite(400, 200);
		npcObjs[i].addImage(npcImg[i]);

		npcObjs[i].position.x = random(windowWidth);
		npcObjs[i].position.y = random(windowHeight);
	}
}

function playerController() {
	//occasional flip or unflip player depending on direction of movement
	if (random() < 0.01) {
		player.mirrorX(1);
	}
	if (random() < 0.2) {
		player.mirrorX(-1);
	}

	//limit the player movements
	if (player.position.x < player.width / 2) {
		player.velocity.x = 0;
	}
	if (player.position.y < player.height / 2) {
		player.velocity.y = 0;
	}
	if (player.position.x > width - player.width / 2) {
		player.velocity.x = 0;
	}
	if (player.position.y > height - player.height / 2) {
		player.velocity.y = 0;
	}

	//hidden resizer
	if (keyIsDown(UP_ARROW)) player.scale += 0.05;
	if (keyIsDown(DOWN_ARROW)) player.scale -= 0.05;
}

function drawItems() {
	for (let i = 0; i < currentItems; i++) {
		drawSprite(roomObjs[i]);
	}
}

function drawNPCs() {
	for (let i = 0; i < currentNPCs; i++) {
		drawSprite(npcObjs[i]);
	}
}

function drawRoomText() {
	textFont(f);
	fill(200);
	textSize(36);
	textAlign(LEFT, TOP);
	fill(5);
	rectMode(CORNER);
	rect(0, windowHeight - 50, windowWidth, 50);
	fill(0, 200, 0);
	text(fortune[roomText], textX, windowHeight - 50);
	textX--;
	if (textX + fortune[roomText].length * 25 < 0) {
		textX = 30;
	}
	if (millis() < roomTimer) {
		fill(20);
		textFont(overpass);
		rect(10, 31, titleWords[roomText].length * 25, 50);
		fill(200, 0, 0);
		text(titleWords[roomText], 20, 31);
	}
	//refix alignment
	rectMode(CENTER);
}

function checkForConvo() {
	textFont(f2);

	for (let i = 0; i < npcs; i++) {
		//run through for every npc

		if (player.overlap(npcObjs[i])) {
			//if overlapping
			if (!talking) {
				//if not already in talking mode
				talkTimer = millis() + 6000;
				talking = true;

				//play talk
				audioController();

				player.scale += random(-0.5, 0.5);
				player.scale = constrain(player.scale, 0.2, 2);

				playerImg.filter(ERODE);
			}
		}
	}
}

function haveConvo() {
	if (talking) {
		if (millis() < talkTimer) {
			//show talk text
			textSize(36);
			fill(0);
			rectMode(CENTER);

			if (params.page) {
				//magic nums to make print sizing look better
				textSize(88);
				rect(windowWidth / 2, windowHeight / 2, windowWidth / 3, windowHeight / 10);
			} else {
				rect(windowWidth / 2, windowHeight / 2, windowWidth / 3, windowHeight / 5);
			}

			fill(0, 255, 0);
			textAlign(LEFT, CENTER);

			if (questNum >= questions.length - 1) {
				questNum = 0;
			}

			text(questions[questNum], windowWidth / 2, windowHeight / 2, windowWidth / 4, windowHeight / 4);
		} else {
			talking = false;
			player.scale = 1;
		}
	}
}

function audioController() {
	let talkSnd = int(random(totalSounds));
	talk[talkSnd].play();
}

function resetRoom() {
	roomTimer = millis() + 2500;

	playerImg = playerImgs[floor(random(players))];
	player.addImage(playerImg);

	//pick a new text to display
	roomText = floor(random(fortune.length));
	//reset text x position
	textX = 30;
	//next convo text
	questNum++;

	//change player position and velocity
	player.position.x = random(windowWidth);
	player.position.y = random(windowHeight);
	player.velocity.x = random(-5, 5);
	player.velocity.y = random(-5, 5);
	//make sure it's not agonizingly slow
	while (
		player.velocity.x > -1 &&
		player.velocity.x < 1 &&
		player.velocity.y > -1 &&
		player.velocity.y < 1
	) {
		player.velocity.x = random(-5, 5);
		player.velocity.y = random(-5, 5);
	}

	//
	if (params.page) {
		//if print, add more images since page is huge
		currentItems = int(random(6, 10));
		currentNPCs = int(random(9, 18));
	} else {
		currentItems = int(random(2, 7));
		currentNPCs = int(random(2, 7));
	}

	for (let i = 0; i < currentItems; i++) {
		roomObjs[i].addImage(roomImg[int(random(items))]);
		//	roomObjs[i].scale = random(0.5, 1.5);

		roomObjs[i].position.x = random(windowWidth);
		roomObjs[i].position.y = random(windowHeight);
	}

	for (let i = 0; i < currentNPCs; i++) {
		npcObjs[i].addImage(npcImg[int(random(npcs))]);

		npcObjs[i].velocity.x = random(-1.5, 1.5);
		npcObjs[i].velocity.y = random(-1.5, 1.5);
	}
}

function colorChanger() {
	if (millis() > colorTimer) {
		colorTimer = millis() + random(20000, 44000);
		bw = !bw;
	}

	if (bw) {
		filter(THRESHOLD, 0.65);
	}
}

function detectSave() {
	if (params.seed && params.page) {
		print("saving");
		noLoop();
		saveCanvas(params.seed + "_" + params.page, "png");
	} else if (keyIsPressed && key == "s") {
		noLoop();
		saveCanvas("self-doubting-system", "png");
	}
}

function windowResized() {
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}


