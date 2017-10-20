(function(window, document, $) {
	var initialized = false,
		init = function() {
			$.each(window.onLoadedQueue, function(i, callback) {
				callback();
			});
		};

	$(document).ready(function() {
		if (!initialized) {
			init();
		}
	});

	document.addEventListener('Neos.PageLoaded', function() {
		init();
	}, false);

	window.onLoadedQueue = [];
})(window, document, jQuery);
