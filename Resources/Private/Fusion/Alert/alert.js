(function(window, document, $, onLoadedQueue) {
	var initAlert = function() {
			$('.alert a').addClass('alert-link');
		};

	onLoadedQueue.push(initAlert);
})(window, document, jQuery, window.onLoadedQueue);
