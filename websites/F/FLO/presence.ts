const presence = new Presence({
	clientId: "857504781438681089"
});

function getQuery() {
	return JSON.parse(
		`{"${decodeURI(location.search.substring(1))
			.replace(/"/g, '\\"')
			.replace(/&/g, '","')
			.replace(/=/g, '":"')}"}`
	);
}

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "flo-logo"
		},
		player = document.querySelector(".playbar_wrap");
	if (!(player.querySelector("input.progress") as HTMLInputElement).disabled) {
		const playButton: HTMLButtonElement =
			player.querySelector("button.icon-player");

		[, presenceData.endTimestamp] = presence.getTimestamps(
			presence.timestampFromFormat(
				player
					.querySelector(".time_current")
					.textContent.replace(
						player.querySelector(".time_current").querySelector("span.hidden")
							.textContent,
						""
					)
			),
			presence.timestampFromFormat(
				player
					.querySelector(".time_all")
					.textContent.replace(
						player.querySelector(".time_all").querySelector("span.hidden")
							.textContent,
						""
					)
			)
		);
		presenceData.details = `${player.querySelector("p.title").textContent} - ${
			player.querySelector("p.artist").textContent
		}`;
		if (playButton.className.indexOf("btn-player-play") !== -1) {
			presenceData.smallImageKey = "pause";
			presenceData.smallImageText = "일시 정지";
		} else if (playButton.className.indexOf("btn-player-pause") !== -1) {
			presenceData.smallImageKey = "playing";
			presenceData.smallImageText = "재생";
		}
	} else {
		const { location } = window;
		if (location.pathname === "/") presenceData.details = "메인";
		else if (location.pathname.indexOf("/search") === 0) {
			presenceData.smallImageKey = "search";
			presenceData.details = "검색";
			presenceData.state = getQuery().keyword;

			if (location.pathname === "/search/track") presenceData.details += "(곡)";
			else if (location.pathname === "/search/album")
				presenceData.details += "(앨범)";
			else if (location.pathname === "/search/artist")
				presenceData.details += "(아티스트)";
			else if (location.pathname === "/search/theme")
				presenceData.details += "(테마리스트)";
			else if (location.pathname === "/search/lyrics")
				presenceData.details += "(가사)";
		} else if (location.pathname.indexOf("/new") === 0) {
			presenceData.smallImageKey = "search";
			presenceData.details = "최근 발매 음악";

			if (location.pathname === "/new/track") presenceData.details += "(곡)";
			else if (location.pathname === "/new/album")
				presenceData.details += "(앨범)";
		} else if (location.pathname.indexOf("/help") === 0) {
			presenceData.details = "고객센터";

			if (location.pathname.indexOf("/help/notice") === 0)
				presenceData.state = "공지사항";
			else if (location.pathname.indexOf("/help/faq") === 0)
				presenceData.state = "자주 묻는 문의";
			else if (location.pathname.indexOf("/help/qna") === 0)
				presenceData.state = "1:1 문의";
		} else if (location.pathname.indexOf("/detail/channel") === 0) {
			presenceData.smallImageKey = "search";
			presenceData.details = "테마리스트";
			presenceData.state = document.querySelector("p.title").textContent;
		} else if (location.pathname.indexOf("/detail/album") === 0) {
			presenceData.smallImageKey = "search";
			presenceData.details = "앨범";
			presenceData.state = `${
				document.querySelector("p.title").textContent
			} - ${document.querySelector("p.artist").textContent}`;
		} else if (location.pathname === "/browse") {
			presenceData.smallImageKey = "search";
			presenceData.details = document.querySelector(
				".chart_content_head>h4"
			).textContent;
		} else if (location.pathname.indexOf("/storage") === 0) {
			presenceData.smallImageKey = "search";
			presenceData.smallImageText = "보관함";
			presenceData.details = "보관함";
		} else if (location.pathname.indexOf("/purchase") === 0)
			presenceData.details = "이용권";
		else if (location.pathname === "/intro") presenceData.details = "소개";
	}
	presence.setActivity(presenceData);
});
