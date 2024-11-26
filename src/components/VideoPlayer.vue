<template>
    <div class="video-container">
        <video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered">
            <source :src="videoPlayer">
            <track v-if="subtitleUrl" kind="subtitles" :src="subtitleUrl" label="Español" srclang="es" default>
            <p class="vjs-no-js">
                Para ver este video, por favor habilite JavaScript y considere actualizar
                a un navegador web que soporte video HTML5
            </p>
        </video>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const props = defineProps({
    url: {
        type: String,
        default: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
    subtitleUrl: {
        type: String,
        default: '',
    }
})

const videoPlayer = ref(props.url)
let player = null

const initializePlayer = () => {
    if (videoPlayer.value) {
        player = videojs(videoPlayer.value, {
            controls: true,
            fluid: true,
            playbackRates: [0.5, 1, 1.5, 2],
            controlBar: {
                children: [
                    'playToggle',
                    'volumePanel',
                    'currentTimeDisplay',
                    'timeDivider',
                    'durationDisplay',
                    'progressControl',
                    'playbackRateMenuButton',
                    'subtitlesButton',
                    'fullscreenToggle',
                ],
            },
        })
    }
}

// Inicializar el reproductor cuando el componente se monte
onMounted(() => {
    initializePlayer()
})

// Limpiar el reproductor cuando el componente se desmonte
onBeforeUnmount(() => {
    if (player) {
        player.dispose()
        player = null
    }
})

// Observar cambios en la URL del video
watch(() => props.url, (newUrl) => {
    if (player) {
        player.src({ src: newUrl })
    }
})

// Observar cambios en la URL de los subtítulos
watch(() => props.subtitleUrl, (newSubtitleUrl) => {
    if (player && newSubtitleUrl) {
        // Remover tracks existentes
        const tracks = player.remoteTextTracks();
        const trackCount = tracks.length;
        for (let i = 0; i < trackCount; i++) {
            player.removeRemoteTextTrack(tracks[0]);
        }

        // Agregar nuevo track
        player.addRemoteTextTrack({
            kind: 'subtitles',
            src: newSubtitleUrl,
            srclang: 'es',
            label: 'Español',
            default: true
        }, false);
    }
})
</script>

<style scoped>
.video-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}

:deep(.video-js) {
    width: 100%;
    height: 0;
    padding-top: 56.25%;
    /* Aspect ratio 16:9 */
}

:deep(.video-js.vjs-fluid) {
    padding-top: 56.25%;
    width: 100%;
    max-width: 100%;
    height: auto;
}

:deep(.video-js .vjs-big-play-button) {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>