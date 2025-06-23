document.addEventListener('DOMContentLoaded', function() {
    const videoElements = document.querySelectorAll('video[data-video-url]');
    const videoModal = document.getElementById('videoModal');
    const modalVideoPlayer = document.getElementById('modalVideoPlayer');
    const closeButton = document.querySelector('.close-button');

    let originalPageUrl = window.location.href.split('?')[0]; // Guarda la URL original sin parámetros
    let currentPlayingSmallVideo = null; 

    // Función para ABRIR el modal del video
    function openVideoModal(videoUrl, clickedVideoElement) {
        modalVideoPlayer.src = videoUrl;
        videoModal.style.display = 'flex';
        modalVideoPlayer.play();

        if (clickedVideoElement) {
            clickedVideoElement.pause();
            currentPlayingSmallVideo = clickedVideoElement;
        }

        // Cambia la URL en la barra de direcciones para que incluya un identificador del video
        // Usamos un hash (#) para no recargar la página y poder volver fácilmente
        // Example: https://tupagina.com/index.html#video1
        const videoId = clickedVideoElement ? clickedVideoElement.id : ''; // Si viene de un clic, usa su ID
        history.pushState({ path: window.location.pathname + '#modal-video=' + videoId }, '', window.location.pathname + '#modal-video=' + videoId);
    }

    // Función para CERRAR el modal del video
    function closeVideoModal() {
        modalVideoPlayer.pause();
        modalVideoPlayer.src = '';
        videoModal.style.display = 'none';

        if (currentPlayingSmallVideo) {
            currentPlayingSmallVideo.currentTime = 0;
            currentPlayingSmallVideo = null;
        }
        
        // Vuelve a la URL original sin el hash del video
        history.pushState({ path: originalPageUrl }, '', originalPageUrl);
    }

    // Añadir listeners de clic a cada video incrustado
    videoElements.forEach(video => {
        video.addEventListener('click', function() {
            const videoUrl = this.dataset.videoUrl;
            openVideoModal(videoUrl, this);
        });
    });

    // Listener para el botón de cerrar
    closeButton.addEventListener('click', closeVideoModal);

    // Listener para cerrar el modal haciendo clic fuera del contenido del video
    videoModal.addEventListener('click', function(event) {
        if (event.target === videoModal) {
            closeVideoModal();
        }
    });

    // Listener para la navegación del historial (botón "Atrás" del navegador)
    window.addEventListener('popstate', function(event) {
        // Si la URL actual es la original (sin hash de video), cierra el modal
        if (window.location.href.split('#')[0] === originalPageUrl && videoModal.style.display === 'flex') {
            closeVideoModal();
        }
        // Si el modal está abierto y se ha navegado fuera de la URL del video específico, también cierra.
        // Esto previene que el modal se quede abierto si el usuario navega a otra parte del historial
        // que no sea la página principal con el video abierto.
        else if (videoModal.style.display === 'flex' && !window.location.hash.includes('#modal-video=')) {
            closeVideoModal();
        }
    });


    // *** NUEVA LÓGICA: Comprobar la URL al cargar la página ***
    function checkUrlForVideo() {
        const hash = window.location.hash; // Obtiene la parte del hash de la URL (ej. #modal-video=video1)
        if (hash.startsWith('#modal-video=')) {
            const videoIdToOpen = hash.split('=')[1]; // Obtiene el ID del video (ej. 'video1')
            const targetVideoElement = document.getElementById(videoIdToOpen); // Busca el elemento <video> por su ID

            if (targetVideoElement) {
                const videoUrl = targetVideoElement.dataset.videoUrl;
                openVideoModal(videoUrl, targetVideoElement);
                // Si el usuario llega con un link directo, asegúrate de que el estado inicial
                // del historial sea el de la página normal, para que el botón de atrás funcione bien.
                history.replaceState({ path: originalPageUrl }, '', originalPageUrl);
                // Luego, añade el estado del video modal para que al cerrar funcione popstate correctamente.
                history.pushState({ path: window.location.pathname + '#modal-video=' + videoIdToOpen }, '', window.location.pathname + '#modal-video=' + videoIdToOpen);

            }
        }
    }

    // Llama a la función para comprobar la URL cuando la página haya cargado completamente
    checkUrlForVideo();
});