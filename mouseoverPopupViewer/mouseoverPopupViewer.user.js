// ==UserScript==
// @id          org.userscripts.users.kuehlschrank.MouseoverPopupImageViewer
// @name        Mouseover Popup Image Viewer
// @description Shows larger version of thumbnails.
// @version     2013.10.28
// @author      kuehlschrank
// @homepage    http://userscripts.org/scripts/show/109262
// @icon        https://s3.amazonaws.com/uso_ss/icon/109262/large.png
// @updateURL   https://userscripts.org/scripts/source/109262.meta.js
// @downloadURL https://userscripts.org/scripts/source/109262.user.js
// @include     http*
// ==/UserScript==

'use strict';

var d = document, wn = window, _ = {}, hosts;

var cfg = {
	delay: GM_getValue('delay', 500),
	thumbsonly: GM_getValue('thumbsonly', true),
	start: GM_getValue('start', 'auto'),
	zoom: GM_getValue('zoom', 'context'),
	halfzoom: GM_getValue('halfzoom', true),
	css: GM_getValue('css', ''),
	hosts: GM_getValue('hosts', '')
};

function loadHosts() {
	var hosts = [
		/* DO NOT EDIT THE CODE. USE GREASEMONKEY ICON -> USER SCRIPT COMMANDS -> SET UP... */
		{r:/500px\.com\/photo\//, q:'.the_photo'},
		{r:/abload\.de\/image/, q:'#image'},
		{r:/(ecx\.images-amazon\.com\/images\/I\/.+?)\./, s:function(m, node) { return node.parentNode.classList.contains('main-image-inner-wrapper') || node.parentNode.querySelector('#twister-main-image') ? '' : 'http://' + m[1] + '.jpg'; }},
		{r:/depic\.me\/[0-9a-z]{8,}/, q:'#pic'},
		{r:/deviantart\.com\/art\//, s:function(m, node) { return /\b(film|lit)/.test(node.className) || /in Flash/.test(node.title) ? '' : m.input; }, q:['#download-button[href*=".jpg"], #download-button[href*=".gif"], #download-button[href*=".png"], #gmi-ResViewSizer_fullimg', 'img.dev-content-full']},
		{r:/disqus\.com/, s:''},
		{r:/dropbox\.com\/s\/.+\.(jpe?g|gif|png)/i, q:'#download_button_link'},
		{r:/ebay\.[^\/]+\/itm\//, q:function(text) { return text.match(/https?:\/\/i\.ebayimg\.com\/[^\.]+\.JPG/i)[0].replace(/~~60_\d+/, '~~60_57'); }},
		{r:/i.ebayimg.com/, s:function(m ,node) { if(node.parentNode.querySelector('.zoom_trigger_mask')) return ''; return m.input.replace(/~~60_\d+/, '~~60_57'); }},
		{r:/fastpic\.ru\/view\//, q:'#image'},
		{r:/(fbcdn|fbexternal).*?(app_full_proxy|safe_image).+?(src|url)=(http.+?)[&\"']/, s:function(m, node) { return node.parentNode.className.indexOf('video') > -1 && m[4].indexOf('fbcdn') > -1 ? '' : decodeURIComponent(m[4]); }, html:true},
		{r:/facebook\.com\/photo/, s:function(m, node) { if(node.id == 'fbPhotoImage') return false; return m.input; }, q:['a.fbPhotosPhotoActionsItem[href$="dl=1"]', '#fbPhotoImage', '#root img', '#root i.img'], rect:'#fbProfileCover'},
		{r:/fbcdn.+?[0-9]+_([0-9]+)_[0-9]+_[a-z]\.jpg/, s:function(m, node) { try { return unsafeWindow.PhotoSnowlift.getInstance().stream.cache.image[m[1]].url; } catch(ex) {} return false; }, manual:true},
		{r:/(https?:\/\/(fbcdn-[\w\.\-]+akamaihd|[\w\.\-]+?fbcdn)\.net\/[\w\/\.\-]+?)_[a-z]\.jpg/, s:function(m, node) { if(node.id == 'fbPhotoImage') { var a = d.body.querySelector('a.fbPhotosPhotoActionsItem[href$="dl=1"]'); if(a) { return a.href.indexOf(m.input.match(/[0-9]+_[0-9]+_[0-9]+/)[0]) > -1 ? '' : a.href; } } if(node.parentNode.outerHTML.indexOf('/hovercard/') > -1) return ''; var gp = node.parentNode.parentNode; if(node.outerHTML.indexOf('profile') > 1 && gp.href && gp.href.indexOf('/photo') > -1) return false; return m[1].replace(/\/[spc][\d\.x]+/g, '') + '_n.jpg'; }, rect:'.photoWrap'},
		{r:/firepic\.org\/\?v=/, q:'.view img[src*="firepic.org"]'},
		{r:/flickr\.com\/photos\/([0-9]+@N[0-9]+|[a-z0-9_\-]+)\/([0-9]+)/, s:'http://www.flickr.com/photos/$1/$2/sizes/l/', q:'#allsizes-photo > img'},
		{r:/hotimg\.com\/image\/([a-z0-9]+)/i, s:'http://www.hotimg.com/direct/$1'},
		{r:/imagearn\.com\/image/, q:'#img', xhr:true},
		{r:/imagefap\.com\/(image|photo)/, q:'#gallery + noscript'},
		{r:/imagebam\.com\/image\//, q:'img[id]'},
		{r:/imageban\.(ru|net)\/show|imgnova\.com|cweb-pix\.com|(imagebunk|imagewaste)\.com\/(image|pictures\/[0-9]+)/, q:'#img_obj', xhr:true},
		{r:/(imagepdb\.com|imgsure\.com)\/\?v=([0-9]+)/, s:'http://$1/images/$2.jpg', xhr:true},
		{r:/imageshack\.us\/((i|f|photo)\/|my\.php)/, q:['div.codes > div + div', '#main_image, #fullimg']},
		{r:/imageshost\.ru\/photo\//i, q:'#bphoto'},
		{r:/imageteam\.org\/img/, q:'img[alt="image"]'},
		{r:/(imagetwist|imageshimage)\.com\/[a-z0-9]{8,}/, q:'img.pic', xhr:true},
		{r:/imageupper\.com\/i\//, q:'#img', xhr:true},
		{r:/imagepix\.org\/image\/(.+)\.html$/, s:'http://imagepix.org/full/$1.jpg', xhr:true},
		{r:/(img[0-9]+\.imageporter\.com\/i\/[0-9]+\/[a-z0-9]+)_t\.jpg/i, s:'http://$1.jpg', xhr:true},
		{r:/imagevenue\.com\/img\.php/, q:'#thepic'},
		{r:/imagezilla\.net\/show\//, q:'#photo', xhr:true},
		{r:/media-imdb\.com\/images\/.+?\.jpg/, s:function(m, node) { return m.input.replace(/V1\.?_.+?\./g, ''); }},
		{r:/imgbox\.com\/([a-z0-9]+)$/i, q:'#img', xhr:location.hostname != 'imgbox.com'},
		{r:/imgchili\.(net|com)\/show/, q:'#show_image', xhr:true},
		{r:/imgmoney\.com\/img-/, q:'img.centred_resized', xhr:true, post:'imgContinue=Continue%20to%20image%20...%20'},
		{r:/(imgrill\.com\/upload\/)small(\/.+?\.jpg)/, s:'http://$1big$2', xhr:true},
		{r:/imgtheif\.com\/image\//, q:'a > img[src*="/pictures/"]'},
		{r:/imgur\.com\/(a|gallery)\/([a-z0-9]+)/i, s:function(m, node) { return 'http://' + m[0] + (m[1] == 'a' ? '/noscript' : ''); }, g:{entry:'div.image', image:'img', caption:['h2', 'div.description'], title:'meta[name="twitter:title"]'}},
		{r:/imgur\.com\/(r\/[a-z]+\/|[a-z0-9]+#)?([a-z0-9]{5,})b?($|\?)/i, s:'http://i.imgur.com/$2.jpg'},
		{r:/instagr(\.am|am\.com)\/p\/([a-z0-9_\-]+)/i, s:'http://instagr.am/p/$2/media/?size=l'},
		{r:/itmages\.ru\/image\/view\//, q:'#image'},
		{r:/gifbin\.com\/.+\.gif/, xhr:true},
		{r:/googleusercontent\.com\/gadgets\/proxy.+?(http.+?)&/, s:function(m, node) { return decodeURIComponent(m[1]); }},
		{r:/googleusercontent\.com\//, s:function(m, node) { if(node.parentNode.className.indexOf('yt-thumb') > -1 || node.outerHTML.match(/favicons\?|\b(Ol Rf Ep|Ol Zb ag|Zb HPb|Zb Gtb|Rf Pg)\b/)) return ''; return m.input.replace(/\/(s\d{2,}[ck\-]*?|w\d+-h\d+(-[po])?)\//g, '/s0/'); }},
		{r:/heberger-image\.fr\/images/, q:'#myimg'},
		{r:/hostingkartinok\.com\/show-image\.php.*/, q:'.image img'},
		{r:/(lazygirls\.info\/.+_.+?\/[a-z0-9_]+)($|\?)/i, s:'http://www.$1?display=fullsize', q:'img.photo', xhr:location.hostname != 'www.lazygirls.info'},
		{r:/ld-host\.de\/show/, q:'#image'},
		{r:/listal\.com\/(view)?image\/([0-9]+)/, s:'http://www.listal.com/image/$2/0full.jpg'},
		{r:/lostpic\.net\/\?(photo|view)/, q:'.casem img'},
		{r:/memegenerator\.net\/instance\/([0-9]+)/, s:'http://images.memegenerator.net/instances/500x/$1.jpg'},
		{r:/(photos\.modelmayhem\.com\/photos\/[0-9a-z\/]+)_m\.jpg/, s:'http://$1.jpg'},
		{r:/(photos\.modelmayhem\.com\/avatars\/[0-9a-z\/]+)_t\.jpg/, s:'http://$1_m.jpg'},
		{r:/(min\.us|minus\.com)\/l([a-z0-9]+)$/i, s:'http://i.min.us/i$2.jpg'},
		{r:/(panoramio\.com\/.*?photo(\/|_id=)|google\.com\/mw-panoramio\/photos\/[a-z]+\/)(\d+)/, s:'http://static.panoramio.com/photos/original/$3.jpg'},
		{r:/(\d+\.photobucket\.com\/.+\/)(\?[a-z=&]+=)?(.+\.(jpe?g|png|gif))/, s:'http://i$1$3', xhr:location.hostname.indexOf('photobucket.com') < 0},
		{r:/(photosex\.biz|posteram\.ru)\/.+?id=/i, q:'img[src*="/pic_b/"]', xhr:true},
		{r:/pic4all\.eu\/(images\/|view\.php\?filename=)(.+)/, s:'http://$1/images/$3'},
		{r:/piccy\.info\/view3\/(.*)\//, s:'http://piccy.info/view3/$1/orig/', q:'#mainim'},
		{r:/picshd\.com\/([a-z0-9]+)$/i, s:'http://i.picshd.com/$1.jpg'},
		{r:/picsee\.net\/([\d\-]+)\/(.+?)\.html/,s:'http://picsee.net/upload/$1/$2'},
		{r:/picturescream\.com\/\?v=/, q:'#imagen img'},
		{r:/(picturescream\.[a-z\/]+|imagescream\.com\/img)\/(soft|x)/, q:'a > img[src*="/images/"]'},
		{r:/pimpandhost\.com\/(image|guest)\//, q:'#image'},
		{r:/pixhost\.org\/show\//, q:'#show_image', xhr:true},
		{r:/pixhub\.eu\/images/, q:'.image-show img', xhr:true},
		{r:/pixroute\.com\/.+\.html$/, q:'img[id]', xhr:true},
		{r:/(pixsor\.com|euro-pic\.eu)\/share-([a-z0-9_]+)/i, s:'http://www.$1/image.php?id=$2', xhr:true},
		{r:/postima?ge?\.org\/image\//, q:'center img'},
		{r:/(qkme\.me|quickmeme\.com\/meme)\/([a-z0-9]+)/i, s:'http://i.qkme.me/$2.jpg'},
		{r:/radikal\.ru\/(fp|.+\.html)/, q:function(text) { return text.match(/http:\/\/[a-z0-9]+\.radikal\.ru[a-z0-9\/]+\.(jpg|gif|png)/i)[0] }},
		{r:/screenlist\.ru\/details/, q:'#picture'},
		{r:/sharenxs\.com\/view\//, q:'div.text-center > img', xhr:true},
		{r:/skrinshot\.ru\/view\.php\?img=(\d+)/, s:'http://skrinshot.ru/files/$1.jpg'},
		{r:/sndcdn\.com.+/, s:function(m, node) { return node.width == 40 && navigator.userAgent.indexOf('WebKit') > -1 || /commentBubble|carouselItem/.test(node.className + node.parentNode.className) ? '' : m.input.replace(/large|t[0-9]+x[0-9]+/, 't500x500'); }},
		{r:/stooorage\.com\/show\//, q:'#page_body div div img', xhr:true},
		{r:/swagirl\.com\/host\/view/, q:'img.img_full_screen'},
		{r:/(swoopic\.com|(imgproof|imgserve)\.net)\/img-/, q:'img.centred_resized', xhr:true},
		{r:/turboimagehost\.com\/p\//, q:'#imageid', xhr:true},
		{r:/(([a-z0-9]+\.twimg\.com|twimg.*?\.akamaihd\.net)\/profile_images\/.+)_[a-z]+(\..+)/i, s:'http://$1$3'},
		{r:/([a-z0-9]+\.twimg\.com\/media\/[a-z0-9_-]+\.(jpe?g|png|gif))/i, s:'https://$1:large', html:true},
		{r:/twimg\.com\/1\/proxy.+?t=(.+?)&/i, s:function(m) { return wn.atob(m[1]).match(/http.+/); }},
		{r:/pic\.twitter\.com\/[a-z0-9]+/i, q:function(text) { return text.match(/https?:\/\/twitter\.com\/[^\/]+\/status\/\d+\/photo\/\d+/i)[0]; }, follow:true},
		{r:/twitpic\.com(\/show\/[a-z]+)?\/([a-z0-9]+)($|#)/i, s:'http://twitpic.com/show/large/$2'},
		{r:/twitter\.com\/.+\/status\/.+\/photo\//, q:'.media img', follow:true},
		{r:/(upix\.me\/files\/.+\/)#(.+)/, s:'http://$1$2'},
		{r:/(upload\.wikimedia\.org\/wikipedia\/[a-z]+\/)thumb\/([a-z0-9]+\/[a-z0-9]+\/.+?\.(jpe?g|gif|png|svg))/i, s:'http://$1$2'},
		{r:/(userserve-ak\.last\.fm\/serve\/).+?(\/\d+)/, s:'http://$1_$2/0.jpg', html:true},
		{r:/(xxxhost\.me|imgtiger\.com)\/viewer/, q:'img[alt]', xhr:true},
		{r:/ytimg\.com\/(v?i)\//, s:function(m, node) { if(m[1] != 'vi' && node.parentNode.className.indexOf('yt-thumb') > -1) return ''; return m.input.replace(/[^\/]+$/, m[1] == 'vi' ? '0.jpg' : 'hq1.jpg'); }, rect:'.video-list-item'},
		{r:/\/\/([^\/]+)\/viewer\.php\?file=(.+)/, s:'http://$1/images/$2', xhr:true},
		{r:/\/\/[^\?:]+\.(jpe?g|gif|png|svg)($|\?)/i}
	];
	if(cfg.hosts) {
		var lines = cfg.hosts.split(/[\r\n]+/);
		for(var i = lines.length, s; i-- && (s = lines[i]);) {
			try {
				var h = JSON.parse(s);
				if(!h.r) throw 'property r missing';
				h.r = new RegExp(h.r, 'i');
				if(h.s && h.s.indexOf('return ') > -1) h.s = new Function('m', 'node', h.s);
				if(h.q && h.q.indexOf('return ') > -1) h.q = new Function('text', h.q);
				hosts.splice(0, 0, h);
			} catch(ex) {
				GM_log('Invalid host: ' + s + '\nReason: ' + ex);
			}
		}
	}
	return hosts;
}

function onMouseOver(e) {
    
	if(e.shiftKey || _.zoom || !activate(e.target)) return;
	_.cx = e.clientX;
	_.cy = e.clientY;
	if(cfg.start == 'auto' && !_.manual)
		_.timeout = wn.setTimeout(startPopup, cfg.delay);
	else if(cfg.start != 'auto' && e.ctrlKey)
		startPopup();
	else
		setZoomCursor(_.node);
}

function onMouseMove(e) {
	_.cx = e.clientX;
	_.cy = e.clientY;
	var r = _.rect;
	_.cr = _.cx < r.right + 2 && _.cx > r.left - 2 && _.cy < r.bottom + 2 && _.cy > r.top - 2;
	if(e.shiftKey) return;
	if(!_.zoomed && !_.cr) return deactivate();
	if(_.zoom) {
		placePopup();
		var bx = _.view.width/6, by = _.view.height/6;
		_.popup.style.cursor = _.cx < bx || _.cx > _.view.width - bx || _.cy < by || _.cy > _.view.height - by ? '' : 'none';
	} else {
		placeStatus();
	}
}

function onMouseDown(e) {
	if(e.which != 3 && !e.shiftKey) deactivate(true);
}

function onMouseOut(e) {
	if(!e.relatedTarget && !e.shiftKey) deactivate();
}

function onMouseScroll(e) {
	var dir = (e.deltaY || -e.wheelDelta) > 0 ? 1 : -1;
	if(_.zoom) {
		drop(e);
		_.scale *= dir > 0 ? 0.5 : 2;
		if(_.scale < _.minScale) {
			if(!_.gItems || _.gItems.length < 2) return deactivate(true);
			_.scale = scale(_.popup, true);
			_.zoom = false;
		}
		placePopup();
		setTitle();
	} else if(_.gItems && _.gItems.length > 1 && _.popup) {
		drop(e);
		nextGalleryItem(dir);
	} else if(cfg.zoom == 'wheel' && dir < 0 && _.popup) {
		drop(e);
		toggleZoom();
	} else {
		deactivate();
	}
}

function onKeyDown(e) {
	if(e.keyCode == 17 && (cfg.start != 'auto' || _.manual) && !_.popup) startPopup();
}

function onKeyUp(e) {
	switch(e.keyCode) {
		case 16:
			_.popup && (_.zoomed || !('cr' in _) || _.cr) ? toggleZoom() : deactivate(true);
			break;
		case 17:
			if(cfg.start == 'auto' && !_.manual) deactivate(true);
			break;
		case 27:
			off(d, 'mouseover', onMouseOver);
			deactivate();
			break;
		case 74:
			drop(e);
			nextGalleryItem(1);
			break;
		case 75:
			drop(e);
			nextGalleryItem(-1);
			break;
		case 84:
			GM_openInTab(_.popup.src);
			deactivate();
			break;
		default:
			deactivate(true);
	}

}

function onContext(e) {
	if(e.shiftKey) return;
	if(cfg.zoom == 'context' && _.popup && toggleZoom()) return drop(e);
	if((cfg.start == 'context' || (cfg.start == 'auto' && _.manual)) && !_.status && !_.popup) {
		startPopup();
		return drop(e);
	}
	deactivate(true);
}

function startPopup() {
	_.node.style.cursor = '';
	_.g ? startGalleryPopup() : startSinglePopup(_.url);
}

function startSinglePopup(url) {
	setStatus(_.xhr ? 'xhr' : 'loading');
	if(!_.q) return _.xhr ? downloadImage(url, _.url) : setPopup(url);
	parsePage(url, _.q, _.post, function(iurl) {
		if(!iurl) throw 'Image URL not found in node: ' + _.q;
		if(_.follow) {
			var info = findInfo([iurl], _.node, true);
			if(!info || !info.url) throw "Couldn't follow URL: " + iurl;
			for(var prop in info) _[prop] = info[prop];
			return startSinglePopup(_.url);
		}
		if(existsUnscaled(iurl, _.view)) return setStatus(false);
		if(_.xhr) downloadImage(iurl, url); else setPopup(iurl);
	});
}

function startGalleryPopup() {
	setStatus('loading');
	parseGallery(_.url, _.g.entry, _.g.image, _.g.caption, _.g.title, function(items) {
		_.gItems = items;
		_.gIndex = -1;
		if(_.gItems)
			nextGalleryItem(1);
		else
			showError('Empty: ' + _.url);
	})
}

function nextGalleryItem(dir) {
	if(dir > 0 && ++_.gIndex >= _.gItems.length)
		_.gIndex = 0;
	else if(dir < 0 && --_.gIndex < 0)
		_.gIndex = _.gItems.length - 1;
	var item = _.gItems[_.gIndex];
	setPopup(false);
	startSinglePopup(item.url);
	var c = _.gItems.length > 1 ? '[' + (_.gIndex + 1) + '/' + _.gItems.length + '] ' : '';
	if(_.gIndex == 0 && _.gItems.title && _.gItems.title != item.desc) c += _.gItems.title + (item.desc ? ' - ' : '');
	if(item.desc) c += item.desc;
	if(c) setCaption(c.trim());
	var preIdx = _.gIndex + dir;
	if(preIdx >= 0 && preIdx < _.gItems.length) {
		var preUrl = _.gItems[preIdx].url;
		on(_.popup, 'load', function() {
			var img = d.createElement('img');
			img.src = preUrl;
		});
	}
}

function activate(node) {
	if(node == _.popup || node == d.body || node == d.documentElement) return;
	var info = parseNode(node);
	if(!info || !info.url || info.node == _.node || existsUnscaled(info.url, info.view)) return;
	deactivate();
	_ = info;
	[_.node, _.node.parentNode, _.node.firstElementChild].forEach(function(n) {
		if(n && n.title) {
			_.tooltip = n.title;
			n.title = '';
		}
	});
	on(d, 'mousemove', onMouseMove);
	on(d, 'mousedown', onMouseDown);
	on(d, 'contextmenu', onContext);
	on(d, 'keydown', onKeyDown);
	on(d, 'keyup', onKeyUp);
	on(d, 'onwheel' in d ? 'wheel' : 'mousewheel', onMouseScroll);
	on(d, 'mouseout', onMouseOut);
	return true;
}

function deactivate(wait) {
	wn.clearTimeout(_.timeout);
	if(_.req && 'abort' in _.req) _.req.abort();
	if(_.node) {
		_.node.style.cursor = '';
		if(_.tooltip) _.node.title = _.tooltip;
	}
	setTitle(true);
	setStatus(false);
	setPopup(false);
	setCaption(false);
	_ = {};
	off(d, 'mousemove', onMouseMove);
	off(d, 'mousedown', onMouseDown);
	off(d, 'contextmenu', onContext);
	off(d, 'keydown', onKeyDown);
	off(d, 'keyup', onKeyUp);
	off(d, 'onwheel' in d ? 'wheel' : 'mousewheel', onMouseScroll);
	off(d, 'mouseout', onMouseOut);
	if(wait) {
		off(d, 'mouseover', onMouseOver);
		wn.setTimeout(function() { on(d, 'mouseover', onMouseOver); }, 200);
	}
}

function parseNode(node) {
	var info;
	if(tag(node) == 'IMG' && node.src.substr(0, 5) != 'data:') {
		var src = rel2abs(node.src, location.href);
		info = findInfo([src], node);
		if(info) return info;
	}
	if(tag(node.parentNode) == 'A') node = node.parentNode; else if(tag(node.parentNode.parentNode) == 'A') node = node.parentNode.parentNode;
	if(tag(node) == 'A') {
		if(cfg.thumbsonly && !node.querySelector('img, i') && !hasBg(node) && !hasBg(node.parentNode) && !hasBg(node.firstElementChild)) return;
		var url  = decodeURIComponent(node.getAttribute('data-expanded-url') || node.href);
		var urls = url.indexOf('//t.co/') > -1 ? ['http://' + node.textContent] : parseUrls(url);
		info = findInfo(urls, node);
		if(info) return info;
	}
	if(tag(node) == 'IMG' || tag(node) == 'A' && (node = node.querySelector('img'))) {
		return {url:node.src, node:node, rect:rect(node), view:viewRect()};
	}
}

function findInfo(urls, node, noHtml) {
	var html = noHtml ? false : node.outerHTML;
	if(!hosts) hosts = loadHosts();
	for(var i = 0, len = hosts.length, h, m; i < len && (h = hosts[i]); i++) {
		if(!(m = h.html && html ? h.r.exec(html) : findMatch(urls, h.r))) continue;
		if(tag(node) == 'IMG' && !h.s) continue;
		var info = {
			node: node,
			url: 's' in h ? (typeof h.s == 'function' ? h.s(m, node) : replace(h.s, m)) : m.input,
			q: h.q,
			g: h.g,
			xhr: h.xhr,
			post: h.post,
			follow: h.follow,
			manual: h.manual,
			rect: rect(node, h.rect),
			view: viewRect()
		};
		if(info.url === false) continue;
		return info;
	};
}

function downloadPage(url, post, cb) {
	var opts = {
		method: 'GET',
		url: url,
		ignoreCache: true,
		onload: function(req) {
			try {
				delete _.req;
				cb(req.responseText);
			} catch(ex) {
				showError(ex);
			}
		},
		onerror: showError
	};
	if(post) {
		opts.method = 'POST';
		opts.data = post;
		opts.headers = {'Content-Type':'application/x-www-form-urlencoded','Referer':url};
	}
	_.req = GM_xmlhttpRequest(opts);
}

function downloadImage(url, referer) {
	_.req = GM_xmlhttpRequest({
		method: 'GET',
		url: url,
		overrideMimeType: 'text/plain; charset=x-user-defined',
		headers: {'Accept':'image/png,image/*;q=0.8,*/*;q=0.5','Referer':referer},
		onprogress: function(e) {
			if(e.lengthComputable) {
				var per = parseInt(e.loaded / e.total * 100, 10) + '%';
				_.status.style.background = 'linear-gradient(to right, rgba(189,214,238,0.85) ' + per + ', rgba(255,255,255,0.85) ' + per + ') padding-box';
			}
		},
		onload: function(req) {
			try {
				delete _.req;
				var txt = req.responseText, ui8 = new Uint8Array(txt.length);
				for(var i = txt.length; i--;) {
					ui8[i] = txt.charCodeAt(i);
				}
				var b = new Blob([ui8.buffer]);
				var u = wn.URL || wn.webkitURL;
				if(u) return setPopup(u.createObjectURL(b));
				var fr = new FileReader();
				fr.onload = function() { setPopup(fr.result); };
				fr.onerror = showError;
				fr.readAsDataURL(b);
			} catch(ex) {
				showError(ex);
			}
		},
		onerror: showError
	});
}

function parsePage(url, q, post, cb) {
	downloadPage(url, post, function(html) {
		if(typeof q == 'function') return cb(q(html));
		var node, doc = d.implementation.createHTMLDocument('MPIV');
		doc.documentElement.innerHTML = html;
		if(Array.isArray(q)) {
			for(var i = 0, len = q.length; i < len; i++) {
				node = doc.querySelector(q[i]);
				if(node) break;
			}
		} else {
			node = doc.querySelector(q);
		}
		if(!node) throw 'Node not found: ' + q + '\nPage: ' + url;
		cb(findImage(node, url));
	});
}

function parseGallery(url, qE, qI, qC, qT, cb) {
	downloadPage(url, null, function(text) {
		var doc = d.implementation.createHTMLDocument('MPIV');
		doc.documentElement.innerHTML = text;
		var nodes = doc.querySelectorAll(qE), items = [];
		if(!Array.isArray(qC)) qC = [qC];
		for(var i = 0, node, len = nodes.length; i < len && (node = nodes[i]); i++) {
			var item = {};
			try {
				item.url = findImage(node.querySelector(qI), url);
				item.desc = qC.reduce(function(prev, q) {
					var n = node.querySelector(q);
					return n ? (prev ? prev + ' - ' : '') + n.textContent : prev;
				}, '');
			} catch(ex) {}
			if(item.url) items.push(item);
		}
		var title = doc.querySelector(qT);
		if(title) items.title = title.getAttribute('value') || title.textContent;
		cb(items.length > 0 ? items : false);
	});
}

function findImage(node, url) {
	var path;
	switch(tag(node)) {
		case 'IMG':
			path = node.getAttribute('src').trim();
			break;
		case 'A':
			path = node.getAttribute('href').trim();
			break;
		default:
			path = node.outerHTML.match(/https?:\/\/[.\/a-z0-9_+%\-]+\.(jpe?g|gif|png|svg)/i)[0];
	}
	var base = node.ownerDocument.querySelector('base[href]');
	return rel2abs(path, base ? base.getAttribute('href') : url);
}

function checkProgress(start) {
	if(start === true) {
		if(checkProgress.interval) wn.clearInterval(checkProgress.interval);
		checkProgress.interval = wn.setInterval(checkProgress, 150);
		return;
	}
	var p = _.popup;
	if(!p) return wn.clearInterval(checkProgress.interval);
	if(!p.naturalHeight) return;
	setStatus(false);
	wn.clearInterval(checkProgress.interval);
	p.style.display = '';
	var s = wn.getComputedStyle(p);
	_.pw = styleSum(s, ['padding-left', 'padding-right']);
	_.ph = styleSum(s, ['padding-top', 'padding-bottom']);
	_.mbw = styleSum(s, ['margin-left', 'margin-right', 'border-left-width', 'border-right-width']);
	_.mbh = styleSum(s, ['margin-top', 'margin-bottom', 'border-top-width', 'border-bottom-width']);
	_.scale = scale(p, true);
	placePopup();
	setTitle();
	if(_.tooltip && !_.caption) setCaption(_.tooltip);
	if(_.large = p.naturalWidth > p.clientWidth + _.mbw || p.naturalHeight > p.clientHeight + _.mbh) {
		setZoomCursor(p);
		setZoomCursor(_.node);
	} else {
		p.style.cursor = 'none';
	}
}

function setZoomCursor(node) {
	node.style.cursor = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABD5JREFUeNqclFtsVFUUhr99LkPn0jKd0kIJVCgRWlvAxmCUVohBTSQ8QIxGYySoPOiDgZj4YqI+GR950AQeSNBAJDyYoDEkYqS0BhWo1laowlCYIqWdmdKZ6Uzndm6umSFRLi+yk5U5s8/a//nXv/61FXwIFODFJ2FZB2QznaRKz1FUz+OqHpQ3iekep9E3QLBhACcJx05DypFzBncv2cnJzzwoW8CcfcTtvQ890sTTHSFagjq5stdyfqLQc354VtLK39LivcFcTlAlH/MeQMXD+2v7y1ec9LcvffbAy63s3LSo+uq/a2BsjneOTvLHSHyayavryBaT92OoeHdYmKl9Ptvd+/vHa+hsDVRf3MzKdyRfedAoW3p112P9+2OMTpQu0mp043r3Adx9vp2p4viRjzp5dUMTsbQrYIqAT74vaD5D4brQsACW1iviOYvWt4bxNG8nPv3w3YAaqfkdy9Y3CliYXMnlzxmPSFBh2S7HziWZnbeJhBRTOY9UwWVxyOSlLYvhVuGVmvb5O0Jj3tu2rStEpaiRaYu85XIjVeZKokAiaxFNFJm4ZVN2XK6lnSqLHV1Boa8/IWeCFU41QWphYJiPR0ypCYt0yRNGFieGU1KmRzigM3gpwy/jWbY+GqG+rqZk2Cfa+YxGlLlKRBu90zaOezXv0A0OqbzFXFmxYVWItJQ6Npmnc2mAtqYFsu9WWVZkr1SB7Vp49tS9Gta535y6VpTHEmsaLG5kHQJ+g4UhQ2zn0CAsF4ofY1Jug2ZVK+mPil62cwIq1ilRC8HwXAFs9H89OpThx4vzbGjXWBko0X+txETGobMtRLLoVv8HBWzTQw5z6TyfnhScgHkJ5ReQutshfVBFUXHLnkkRZHP/5cLKt/vq6F0lHc6VmSl4uJqGrlzWhm3e7PbQ5dxPk34uJh1uTmTXUmdMoWsjtcaIr7SYCNJ3VJTUwvhbLnf3NDd/tTvM6pUyOo7HvFglGNCqk5SJ2wzeCjKaNlndpHHwuxuc7J8W15u7xLBf4FYAo8Lw+gqIXSnSs+TLRKGp97NTqWVjcY9M1uam2OXXv8scGMiz+2CSs3GHZ7rqGZ+12NgRxjYV0b/mtmMKNc0YQc1WBvaDf2+b5Z0wk3mdlLUV3XwKn1qM7RXF5d/jV1flPtjT29vMC31LuJQss7p5ASfOxvlhMAH1wdcwx44YtUvgdrgSpnOIiHsITZQ2jHZsawbXTqAqqf6hM2cSh326xubHFnHuep6N65rIyAQNDc8dxqiPiVM3U72KupbLwDZDudJ+Ma6m2+h6Uqwg8yW+U5KqjFF8Wiw2nt3uirQdbQEuTJdYuyJE1pJGTvv6NP7PqhSiSQOCxq7BnxOcHpqhtUHHL15taRQLuFabwYOsCqhcEr9dSH+elQlqjfg4Ny5md539DwZYZSugpopFo5lPopbXTMQ4Tkl/7x8BBgA15NXR6NAotQAAAABJRU5ErkJggg=="), all-scroll';
}

function placePopup() {
	var p = _.popup;
	if(!p) return;
	var x = null, y = null, w = Math.round(_.scale * p.naturalWidth), h = Math.round(_.scale * p.naturalHeight), cx = _.cx, cy = _.cy, vw = _.view.width, vh = _.view.height;
	if(!_.zoom && (!_.gItems || _.gItems.length < 2)) {
		var r = _.rect, rx = (r.left + r.right) / 2, ry = (r.top + r.bottom) / 2;
		if(vw - r.right - 40 > w + _.mbw || w + + _.mbw < r.left - 40) {
			if(h + _.mbh < vh - 60) y = Math.min(Math.max(ry - h/2, 30), vh - h - 30);
			x = rx > vw/2 ? r.left - 40 - w : r.right + 40;
		} else if(vh - r.bottom - 40 > h + _.mbh || h + _.mbh < r.top - 40) {
			if(w + _.mbw < vw - 60) x = Math.min(Math.max(rx - w/2, 30), vw - w - 30);
			y = ry > vh/2 ? r.top - 40 - h : r.bottom + 40;
		}
	}
	if(x == null) x = Math.round((vw > w ? vw/2 - w/2 : -1 * Math.min(1, Math.max(0, 5/3*(cx/vw-0.2))) * (w - vw)) - (_.pw + _.mbw)/2);
	if(y == null) y = Math.round((vh > h ? vh/2 - h/2 : -1 * Math.min(1, Math.max(0, 5/3*(cy/vh-0.2))) * (h - vh)) - (_.ph + _.mbh)/2);
	p.style.width  = w + 'px';
	p.style.height = h + 'px';
	p.style.left = x + 'px';
	p.style.top  = y + 'px';
}

function placeStatus() {
	var s = _.status;
	if(s) {
		s.style.left = _.cx + 'px';
		s.style.top  = _.cy + 'px';
	}
}

function toggleZoom() {
	var p = _.popup;
	if(!p || !p.naturalHeight) return;
	p.style.cursor = 'none';
	_.node.style.cursor = '';
	_.zoom = !_.zoom;
	_.zoomed = true;
	_.scale = _.minScale = scale(p, !_.zoom);
	placePopup();
	setTitle();
	setCaption(false);
	return _.zoom;
}

function showError(o) {
	setStatus('error');
	if(!o.responseText && !o.target) GM_log(o);
}

function setStatus(status) {
	var s = _.status;
	if(s) { s.parentNode.removeChild(s); delete _.status; }
	if(!status) return;
	var svg = status == 'error' ?
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:x="http://www.w3.org/1999/xlink" viewBox="0 0 100 100"><g><polygon id="p" points="43,5 57,5 57,43 95,43 95,57 57,57 57,95 43,95 43,57 5,57 5,43 43,43" transform="rotate(43 50 50)" style="fill:#a20e11;stroke-width:3;stroke:#990000"/></g></svg>'
		:
			'<svg xmlns="http://www.w3.org/2000/svg" xmlns:x="http://www.w3.org/1999/xlink" viewBox="0 0 100 100"><defs><rect id="r" x="45.5" y="9" width="7" height="23" rx="2" ry="2" style="fill:#78a2b3;stroke-width:0.3;stroke:gray"/></defs><g><animateTransform attributeName="transform" type="rotate" additive="sum" values="0 50 50; 360 50 50" dur="3s" repeatCount="indefinite"/><use x:href="#r"/><use x:href="#r" transform="rotate(30 50 50)"/><use x:href="#r" transform="rotate(60 50 50)"/><use x:href="#r" transform="rotate(90 50 50)"/><use x:href="#r" transform="rotate(120 50 50)"/><use x:href="#r" transform="rotate(150 50 50)"/><use x:href="#r" transform="rotate(180 50 50)"/><use x:href="#r" transform="rotate(210 50 50)"/><use x:href="#r" transform="rotate(240 50 50)"/><use x:href="#r" transform="rotate(270 50 50)"/><use x:href="#r" transform="rotate(300 50 50)"/><use x:href="#r" transform="rotate(330 50 50)"/></g></svg>';
	if(status == 'xhr') svg = svg.replace('78a2b3', '777777').replace('3s', '6s');
	s = _.status = d.createElement('div');
	s.setAttribute('status', status);
	s.style.cssText = 'position:fixed;z-index:2147483647;left:' + _.cx + 'px;top:' + _.cy + 'px;height:40px;width:40px;margin:20px 0 0 20px;padding:0;background:rgba(255,255,255,0.85) padding-box;border:1px solid gray;border-radius:8px;cursor:none';
	s.innerHTML = '<img style="border:0;margin:0;width:40px;height:40px" src="data:image/svg+xml;base64,' + wn.btoa(svg) + '"/>';
	d.body.appendChild(s);
}

function setPopup(src) {
	var p = _.popup;
	if(!p && !src) return;
	if(!p) {
		p = _.popup = d.createElement('img');
		p.style.cssText = 'display:none;border:1px solid gray;background-color:white;position:fixed;z-index:2147483647;margin:0;cursor:default;max-width:none;max-height:none;' + cfg.css;
		on(p, 'error', showError);
		d.body.appendChild(p);
	}
	if(src) {
		p.src = src;
		p.style.display = 'none';
		checkProgress(true);
	} else {
		_.zoom = false;
		off(p, 'error', showError);
		p.parentNode.removeChild(p);
		delete _.popup;
		if(_.node) _.node.style.cursor = '';
	}
}

function setCaption(caption) {
	var c = _.caption;
	if(!caption) {
		if(c) { c.parentNode.removeChild(c); delete _.caption; }
		return
	}
	if(!c) {
		c = _.caption = d.createElement('div');
		c.style.cssText = 'position:fixed;z-index:2147483647;left:0;right:0;top:-50px;transition:top 500ms;text-align:center;font-family:sans-serif;font-size:15px;font-weight:bold;background:rgba(0, 0, 0, 0.6);color:white;padding:4px 10px';
		wn.setTimeout(function() { c.style.top = '0px'; }, 500);
	}
	d.body.appendChild(c);
	c.textContent = caption;
}

function setTitle(reset) {
	if(reset) {
		if(_.title) d.title = _.title;
	} else {
		if(!_.title) _.title = d.title;
		var p = _.popup;
		d.title = p.naturalWidth + 'x' + p.naturalHeight + ' @ ' + Math.round((p.clientHeight - _.ph) / p.naturalHeight * 100) + '%';
	}
}

function parseUrls(url) {
	var end = url.length - 1, urls = [];
	if(url.charAt(end) == '#') return urls;
	while(true) {
		var pos = url.lastIndexOf('http', end);
		if(pos === 0 && urls.length === 0) {
			urls.push(url);
			break;
		}
		if(pos < 0) break;
		if(/https?:\/\/[^&]+/.exec(url.substring(pos, end + 1))) {
			urls.push(RegExp.lastMatch);
		}
		if(pos === 0) break;
		end = pos - 1;
	}
	return urls;
}

function findMatch(a, re) {
	for(var i = a.length; i--;) {
		var m = re.exec(a[i]);
		if(m) return m;
	}
}

function rel2abs(rel, abs) {
	if(rel.indexOf('//') === 0) rel = 'http:' + rel;
	var re = /^([a-z]+:)?\/\//;
	if(re.test(rel))  return rel;
	if(!re.exec(abs)) return;
	if(rel[0] == '/') return abs.substr(0, abs.indexOf('/', RegExp.lastMatch.length)) + rel;
	return abs.substr(0, abs.lastIndexOf('/')) + '/' + rel;
}

function replace(s, m) {
	for(var i = m.length; i--;) {
		s = s.replace('$'+i, m[i]);
	}
	return s;
}

function styleSum(s, p) {
	for(var i = p.length, x = 0; i--;) {
		x += parseInt(s.getPropertyValue([p[i]]), 10) || 0;
	}
	return x;
}

function scale(p, fit) {
	var vw = _.view.width, vh = _.view.height;
	return _.large && !fit ?
			(cfg.halfzoom && (p.naturalHeight / vh > 3 && p.naturalWidth > vw || p.naturalWidth / vh > 3 && p.naturalHeight > vh) ? 0.5 : 1)
		:
			Math.min((vw - _.mbw)/p.naturalWidth, (vh - _.mbh)/p.naturalHeight, fit ? 1 : Number.MAX_VALUE);
}

function hasBg(node) {
	return node ? wn.getComputedStyle(node).backgroundImage != 'none' : false;
}

function existsUnscaled(url, view) {
	for(var i = d.images.length, img; i-- && (img = d.images[i]);) {
        //alert(img.src + "\n" + url + "\n" + (img.src == url) + "\n" + img.clientHeight + "\n" + img.naturalHeight + "\n" + (img.clientHeight - img.naturalHeight) + "\n" + img.clientWidth + "\n" + img.naturalWidth + "\n" + (img.clientWidth - img.naturalWidth));
        if(img.src == url) {
            if((img.clientHeight - img.naturalHeight > -26) && (img.clientWidth - img.naturalWidth > -26)) return true;
        }
	}
}

function viewRect() {
	var node = d.compatMode == 'BackCompat' ? d.body : d.documentElement;
	return {width:node.clientWidth, height:node.clientHeight};
}

function rect(node, q) {
	if(q) {
		var n = node, p = Element.prototype, m = p.mozMatchesSelector || p.webkitMatchesSelector || p.oMatchesSelector || p.matches;
		if(m) {
			while(tag(n = n.parentNode) != 'BODY') {
				if(m.call(n, q)) return n.getBoundingClientRect();
			}
		}
	}
	var nodes = node.querySelectorAll('*');
	for(var i = nodes.length; i-- && (n = nodes[i]);) {
		if(n.clientHeight > node.clientHeight) node = n;
	}
	return node.getBoundingClientRect();
}

function tag(node) {
	return node.tagName.toUpperCase();
}

function on(node, e, f) {
	node.addEventListener(e, f, false);
}

function off(node, e, f) {
	node.removeEventListener(e, f, false);
}

function drop(e) {
	e.preventDefault();
	e.stopPropagation();
}

function setup() {
	var $ = function(s) { return d.getElementById('mpiv-'+s); }
	if($('setup')) return;
	GM_addStyle('\
		#mpiv-setup { position:fixed;z-index:2147483647;top:30px;right:30px;padding:20px 30px;background:#eee;width:550px;border:1px solid black; }\
		#mpiv-setup * { color:black;text-align:left;line-height:normal;font-size:12px;font-family:sans-serif; }\
		#mpiv-setup a { color:black;text-decoration:underline; }\
		#mpiv-setup div { text-align:center;font-weight:bold;font-size:14px; }\
		#mpiv-setup ul { margin:15px 0 15px 0;padding:0;list-style:none;background:#eee;border:0; }\
		#mpiv-setup input, #mpiv-setup select { border:1px solid gray;padding:2px;background:white; }\
		#mpiv-setup li { margin:0;padding:6px 0;vertical-align:middle;background:#eee;border:0 }\
		#mpiv-delay { width:36px; }\
		#mpiv-hosts { max-height:170px;overflow-y:auto; padding:2px; margin:4px 0; }\
		#mpiv-hosts input, #mpiv-css { width:98%;margin:3px 0; }\
		#mpiv-setup button { width:150px;margin:0 10px;text-align:center; }\
	');
	var div = d.createElement('div');
	div.id = 'mpiv-setup';
	d.body.appendChild(div);
	div.innerHTML = '\
		<div>Mouseover Popup Image Viewer</div><ul>\
		<li>Popup activation: <select><option id="mpiv-start-auto">automatically</option><option id="mpiv-start-context">right click or ctrl</option><option id="mpiv-start-ctrl">ctrl</option></select> <span>after <input id="mpiv-delay" type="text"/> ms</span></li>\
		<li>Zoom activation: <select><option id="mpiv-zoom-context">right click or shift</option><option id="mpiv-zoom-wheel">wheel up or shift</option><option id="mpiv-zoom-shift">shift</option></select></li>\
		<li><input type="checkbox" id="mpiv-thumbsonly"/> Allow popup over text-only links (e.g. headlines)</li>\
		<li><input type="checkbox" id="mpiv-halfzoom"/> Use initial zoom factor of 50% for very large images</li>\
		<li>Custom CSS for popup (units in px):<div><input id="mpiv-css" type="text" spellcheck="false"></div></li>\
		<li>Custom host rules:<div id="mpiv-hosts"><input type="text" spellcheck="false"></div><a href="http://w9p.co/userscripts/mpiv/host_rules.html" target="_blank">Documentation</a></li>\
		</ul><div><button id="mpiv-ok">OK</button><button id="mpiv-cancel">Cancel</button></div>';
	div = null;
	var close = function() { var div = $('setup'); div.parentNode.removeChild(div); };
	on($('ok'), 'click', function() {
		var delay = parseInt($('delay').value, 10);
		if(!isNaN(delay) && delay >= 0) GM_setValue('delay', cfg.delay = delay);
		GM_setValue('thumbsonly', cfg.thumbsonly = !$('thumbsonly').checked);
		GM_setValue('start', cfg.start = $('start-context').selected ? 'context' : ($('start-ctrl').selected ? 'ctrl' : 'auto'));
		GM_setValue('zoom', cfg.zoom = $('zoom-context').selected ? 'context' : ($('zoom-wheel').selected ? 'wheel' : 'shift'));
		GM_setValue('halfzoom', cfg.halfzoom = !!$('halfzoom').checked);
		GM_setValue('css', cfg.css = $('css').value.trim());
		var inps = $('hosts').querySelectorAll('input'), lines = [];
		for(var i = 0; i < inps.length; i++) {
			var s = inps[i].value.trim();
			if(s) lines.push(s);
		}
		lines.sort();
		GM_setValue('hosts', cfg.hosts = lines.join('\n'));
		hosts = loadHosts();
		close();
	});
	var update = function() { $('delay').parentNode.style.display = $('start-auto').selected ? '' : 'none'; };
	on($('start-auto').parentNode, 'change', update);
	on($('cancel'), 'click', close);
	$('delay').value = cfg.delay;
	$('thumbsonly').checked = !cfg.thumbsonly;
	$('start-' + cfg.start).selected = true;
	$('zoom-' + cfg.zoom).selected = true;
	$('halfzoom').checked = cfg.halfzoom;
	$('css').value = cfg.css;
	var check = function(e) {
		var t = e.target, ok;
		try {
			var pes = t.previousElementSibling;
			if(t.value) {
				if(!pes) { var inp = t.cloneNode(); inp.value = ''; t.parentNode.insertBefore(inp, t); }
				new RegExp(JSON.parse(t.value).r);
			} else if(pes) {
				pes.focus();
				t.parentNode.removeChild(t);
			}
			ok = 1;
		} catch(ex) {}
		t.style.backgroundColor = ok ? '' : '#ffaaaa';
	}
	on($('hosts'), 'input', check);
	if(cfg.hosts) {
		var hosts = $('hosts');
		var lines = cfg.hosts.split(/[\r\n]+/);
		for(var i = 0, s, r; i < lines.length && (s = lines[i]); i++) {
			var inp = hosts.firstElementChild.cloneNode();
			inp.value = s;
			hosts.appendChild(inp);
			check({target:inp});
		}
	}
	update();
}

if(d.body.childElementCount != 1 || tag(d.body.firstElementChild) != 'IMG') {
	on(d, 'mouseover', onMouseOver);
	GM_registerMenuCommand('Set up Mouseover Popup Image Viewer', setup);
}
