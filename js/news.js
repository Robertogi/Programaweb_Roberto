(function (d) {
    var e = function (a, b, c, f) {
        this.target = a; this.url = b; this.html = []; this.effectQueue = []; this.version = "3.4.0"; this.options = d.extend({
            ssl: !1, host: "www.feedrapp.info", support: !0, limit: null, key: null, layoutTemplate: "<ul>{entries}</ul>", entryTemplate: '<li><a href="{url}">[{author}@{date}] {title}</a><br/>{shortBodyPlain}</li>', tokens: {}, outputMode: "json", dateFormat: "dddd MMM Do", dateLocale: "en", effect: "show", offsetStart: !1, offsetEnd: !1, error: function () { console.log("jQuery RSS: url doesn't link to RSS-Feed") },
            onData: function () { }, success: function () { }
        }, c || {}); this.callback = f || this.options.success
    }; e.htmlTags = "doctype,html,head,title,base,link,meta,style,script,noscript,body,article,nav,aside,section,header,footer,h1-h6,hgroup,address,p,hr,pre,blockquote,ol,ul,li,dl,dt,dd,figure,figcaption,div,table,caption,thead,tbody,tfoot,tr,th,td,col,colgroup,form,fieldset,legend,label,input,button,select,datalist,optgroup,option,textarea,keygen,output,progress,meter,details,summary,command,menu,del,ins,img,iframe,embed,object,param,video,audio,source,canvas,track,map,area,a,em,strong,i,b,u,s,small,abbr,q,cite,dfn,sub,sup,time,code,kbd,samp,var,mark,bdi,bdo,ruby,rt,rp,span,br,wbr".split(",");
    e.prototype.load = function (a) { var b = "http" + (this.options.ssl ? "s" : "") + "://" + this.options.host + "?support=" + this.options.support + "&version=" + this.version + "&callback=?&q=" + encodeURIComponent(this.url); this.options.offsetStart && this.options.offsetEnd && (this.options.limit = this.options.offsetEnd); null !== this.options.limit && (b += "&num=" + this.options.limit); null !== this.options.key && (b += "&key=" + this.options.key); d.getJSON(b, a) }; e.prototype.render = function () {
        var a = this; this.load(function (b) {
            try {
                a.feed = b.responseData.feed,
                    a.entries = b.responseData.feed.entries
            } catch (c) { return a.entries = [], a.feed = null, a.options.error.call(a) } b = a.generateHTMLForEntries(); a.target.append(b.layout); if (0 !== b.entries.length) { d.isFunction(a.options.onData) && a.options.onData.call(a); var f = d(b.layout).is("entries") ? b.layout : d("entries", b.layout); a.appendEntriesAndApplyEffects(f, b.entries) } 0 < a.effectQueue.length ? a.executeEffectQueue(a.callback) : d.isFunction(a.callback) && a.callback.call(a)
        })
    }; e.prototype.appendEntriesAndApplyEffects = function (a,
        b) { var c = this; d.each(b, function (b, e) { var d = c.wrapContent(e); "show" === c.options.effect ? a.before(d) : (d.css({ display: "none" }), a.before(d), c.applyEffect(d, c.options.effect)) }); a.remove() }; e.prototype.generateHTMLForEntries = function () {
            var a = this, b = { entries: [], layout: null }; d(this.entries).each(function () {
                var c = a.options.offsetStart, f = a.options.offsetEnd; c && f ? index >= c && index <= f && a.isRelevant(this, b.entries) && (c = a.evaluateStringForEntry(a.options.entryTemplate, this), b.entries.push(c)) : a.isRelevant(this, b.entries) &&
                    (c = a.evaluateStringForEntry(a.options.entryTemplate, this), b.entries.push(c))
            }); b.layout = this.options.entryTemplate ? this.wrapContent(this.options.layoutTemplate.replace("{entries}", "<entries></entries>")) : this.wrapContent("<div><entries></entries></div>"); return b
        }; e.prototype.wrapContent = function (a) { return 0 !== d.trim(a).indexOf("<") ? d("<div>" + a + "</div>") : d(a) }; e.prototype.applyEffect = function (a, b, c) {
            switch (b) {
                case "slide": a.slideDown("slow", c); break; case "slideFast": a.slideDown(c); break; case "slideSynced": this.effectQueue.push({
                    element: a,
                    effect: "slide"
                }); break; case "slideFastSynced": this.effectQueue.push({ element: a, effect: "slideFast" })
            }
        }; e.prototype.executeEffectQueue = function (a) { var b = this; this.effectQueue.reverse(); var c = function () { var f = b.effectQueue.pop(); f ? b.applyEffect(f.element, f.effect, c) : a && a() }; c() }; e.prototype.evaluateStringForEntry = function (a, b) { var c = a, f = this; d(a.match(/(\{.*?\})/g)).each(function () { var a = this.toString(); c = c.replace(a, f.getValueForToken(a, b)) }); return c }; e.prototype.isRelevant = function (a, b) {
            var c = this.getTokenMap(a);
            return this.options.filter ? this.options.filterLimit && this.options.filterLimit === b.length ? !1 : this.options.filter(a, c) : !0
        }; e.prototype.getFormattedDate = function (a) { if (this.options.dateFormatFunction) return this.options.dateFormatFunction(a); return "undefined" !== typeof moment ? (a = moment(new Date(a)), a = a.locale ? a.locale(this.options.dateLocale) : a.lang(this.options.dateLocale), a.format(this.options.dateFormat)) : a }; e.prototype.getTokenMap = function (a) {
            if (!this.feedTokens) {
                var b = JSON.parse(JSON.stringify(this.feed));
                delete b.entries; this.feedTokens = b
            } return d.extend({
                feed: this.feedTokens, url: a.link, author: a.author, date: this.getFormattedDate(a.publishedDate), title: a.title, body: a.content, shortBody: a.contentSnippet, bodyPlain: function (a) { for (var a = a.content.replace(/<script[\\r\\\s\S]*<\/script>/mgi, "").replace(/<\/?[^>]+>/gi, ""), b = 0; b < e.htmlTags.length; b++)a = a.replace(RegExp("<" + e.htmlTags[b], "gi"), ""); return a }(a), shortBodyPlain: a.contentSnippet.replace(/<\/?[^>]+>/gi, ""), index: d.inArray(a, this.entries), totalEntries: this.entries.length,
                teaserImage: function (a) { try { return a.content.match(/(<img.*?>)/gi)[0] } catch (b) { return "" } }(a), teaserImageUrl: function (a) { try { return a.content.match(/(<img.*?>)/gi)[0].match(/src="(.*?)"/)[1] } catch (b) { return "" } }(a)
            }, this.options.tokens)
        }; e.prototype.getValueForToken = function (a, b) { var c = this.getTokenMap(b), d = a.replace(/[\{\}]/g, ""), d = c[d]; if ("undefined" !== typeof d) return "function" === typeof d ? d(b, c) : d; throw Error("Unknown token: " + a + ", url:" + this.url); }; d.fn.rss = function (a, b, c) {
            (new e(this, a, b, c)).render();
            return this
        }
})(jQuery);

/* Exibe notícias */
/*
    Como usar:
        showNews(seletor, quantidade, assunto);
*/
showNews('#news', 15, 'furão');

/* Exibe notícias via RSS */
function showNews(htmlElement, totalItems, keyWord) {
    $(htmlElement).rss('https://news.google.com/rss/search?q=' + keyWord + '&hl=pt-BR', {
        limit: totalItems,
        layoutTemplate: '<ul class="list-news">{entries}</ul>',
        entryTemplate: `<li><a href="{url}" target="_blank">{title}</a></li>`
    });
    $('#keyword').html(keyWord);
}
