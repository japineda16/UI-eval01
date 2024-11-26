<template>
    <div class="video-container">
        <video ref="videoPlayer" class="video-js vjs-custom-theme" @click="togglePlay" crossorigin="anonymous">
            <source :src="videoUrl" type="video/mp4">
            <track v-if="subtitleUrl" kind="subtitles" :src="subtitleUrl" label="Español" srclang="es"
                :default="showSubtitles">
        </video>

        <div class="custom-controls">
            <div class="timeline" @click="seek" @mousemove="updateSeekHover" @mouseenter="showTimeTooltip = true"
                @mouseleave="showTimeTooltip = false" @mousedown="startDragging" ref="timeline">
                <div class="progress-bar-background"></div>
                <div class="progress-bar" :style="{ width: progress + '%' }"></div>
                <div class="progress-handle" :style="{ left: progress + '%' }" :class="{ 'active': isDragging }">
                </div>
                <div v-if="showTimeTooltip" class="time-tooltip" :style="{ left: tooltipPosition + 'px' }">
                    {{ formatTime(hoverTime) }}
                </div>
            </div>

            <div class="controls-row">
                <div class="left-controls">
                    <button @click="skipBackward" class="control-button">
                        <i class="bi bi-arrow-counterclockwise"></i>
                    </button>
                    <button @click="togglePlay" class="control-button play-button">
                        <i :class="isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
                    </button>
                    <button @click="skipForward" class="control-button">
                        <i class="bi bi-arrow-clockwise"></i>
                    </button>
                </div>

                <div class="right-controls">
                    <button @click="toggleSubtitles" class="control-button" :class="{ 'active': showSubtitles }">
                        <i class="bi bi-badge-cc-fill"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    videoUrl: String,
    subtitleUrl: String
})

const videoPlayer = ref(null)
const isPlaying = ref(false)
const progress = ref(0)
const showSubtitles = ref(true)
const isDragging = ref(false)

const togglePlay = () => {
    if (videoPlayer.value.paused) {
        videoPlayer.value.play()
        isPlaying.value = true
    } else {
        videoPlayer.value.pause()
        isPlaying.value = false
    }
}

const skipForward = () => {
    videoPlayer.value.currentTime += 10
}

const skipBackward = () => {
    videoPlayer.value.currentTime -= 10
}

const toggleSubtitles = () => {
    const tracks = videoPlayer.value.textTracks[0]
    if (tracks) {
        tracks.mode = showSubtitles.value ? 'hidden' : 'showing'
        showSubtitles.value = !showSubtitles.value
    }
}

const updateProgress = () => {
    if (videoPlayer.value) {
        const percentage = (videoPlayer.value.currentTime / videoPlayer.value.duration) * 100
        progress.value = percentage
    }
}

const startDragging = (event) => {
    isDragging.value = true
    seek(event)
    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', stopDragging)
}

const drag = (event) => {
    if (isDragging.value) {
        seek(event)
    }
}

const stopDragging = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('mouseup', stopDragging)
}

const seek = (event) => {
    const timelineRect = timeline.value.getBoundingClientRect()
    let clickPosition = event.clientX - timelineRect.left

    // Asegurar que el valor esté dentro de los límites
    clickPosition = Math.max(0, Math.min(clickPosition, timelineRect.width))

    const percentage = (clickPosition / timelineRect.width)
    const newTime = percentage * videoPlayer.value.duration
    videoPlayer.value.currentTime = newTime
}

onMounted(() => {
    if (videoPlayer.value) {
        videoPlayer.value.addEventListener('timeupdate', updateProgress)

        const tracks = videoPlayer.value.textTracks
        if (tracks.length > 0) {
            tracks[0].mode = 'showing'
        }
    }
})

onBeforeUnmount(() => {
    if (videoPlayer.value) {
        videoPlayer.value.removeEventListener('timeupdate', updateProgress)
    }
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('mouseup', stopDragging)
})
</script>

<style scoped>
/* Asegúrate de incluir Bootstrap Icons en tu proyecto */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css");

.video-container {
    position: relative;
    width: 100%;
    background: black;
    aspect-ratio: 16/9;
    user-select: none;
}

video {
    width: 100%;
    height: 100%;
}

.custom-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    padding: 20px;
    opacity: 0;
    transition: opacity 0.3s;
}

.video-container:hover .custom-controls {
    opacity: 1;
}

.timeline {
    position: relative;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin-bottom: 15px;
    cursor: pointer;
    transition: height 0.2s ease;
}

.timeline:hover {
    height: 6px;
}

.progress-bar {
    height: 100%;
    background: #ff0000;
    border-radius: 2px;
    transition: width 0.1s;
}

.controls-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.left-controls,
.right-controls {
    display: flex;
    gap: 15px;
}

.control-button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 5px;
    font-size: 1.2rem;
    opacity: 0.9;
    transition: opacity 0.2s;
}

.control-button:hover {
    opacity: 1;
}

.play-button {
    font-size: 1.5rem;
}

.control-button.active {
    color: #007bff;
}

::cue {
    background-color: transparent;
    color: white;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.8);
    font-family: Arial, sans-serif;
    font-size: 1.2em;
    line-height: 1.4;
}

.progress-handle {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #007bff;
    border-radius: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s, width 0.2s, height 0.2s;
}

.timeline:hover .progress-handle,
.progress-handle.active {
    opacity: 1;
}

.progress-handle.active {
    width: 16px;
    height: 16px;
    background: #0056b3;
}

.timeline:hover .progress-handle:hover,
.progress-handle.active {
    transform: translate(-50%, -50%) scale(1.2);
    cursor: grab;
}

.progress-handle.active:hover {
    cursor: grabbing;
}

/* Asegurarse de que el tooltip esté por encima del handle */
.time-tooltip {
    z-index: 2;
}

/* Prevenir la selección de texto mientras se arrastra */
.video-container {
    user-select: none;
}
</style>