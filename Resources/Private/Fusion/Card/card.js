(function(window, document, $, onLoadedQueue) {
	var initCardBody = function() {
			$('.card-body > a').addClass('card-link');
		};

	onLoadedQueue.push(initCardBody);
})(window, document, jQuery, window.onLoadedQueue);
