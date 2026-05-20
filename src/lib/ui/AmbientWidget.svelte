<script lang="ts">
  let audioElement: HTMLAudioElement;
  let fileInput: HTMLInputElement;
  
  let isPlaying = false;
  let tracks: { name: string; url: string }[] = [];
  let currentTrackIndex = 0;
  let currentTime = 0;
  let duration = 0;
  let volume = 0.5;

  function formatTime(seconds: number) {
    if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function togglePlay() {
    if (!audioElement || tracks.length === 0) return;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
  }

  function handleFileSelect(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    // Add all selected files to the queue
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      tracks = [...tracks, { 
        name: file.name.replace(/\.[^/.]+$/, ""), 
        url: URL.createObjectURL(file) 
      }];
    }
    
    // If this is the first batch of songs added, start playing immediately
    if (tracks.length === files.length) {
      playTrack(tracks.length - files.length);
    }
  }

  function playTrack(index: number) {
    currentTrackIndex = index;
    audioElement.src = tracks[index].url;
    audioElement.play();
  }

  function nextTrack() {
    // If there is another track in the queue, play it
    if (currentTrackIndex < tracks.length - 1) {
      playTrack(currentTrackIndex + 1);
    } else {
      isPlaying = false; // Queue finished
    }
  }
</script>

<audio
  bind:this={audioElement}
  bind:volume={volume} 
  on:play={() => isPlaying = true}
  on:pause={() => isPlaying = false}
  on:ended={nextTrack}
  on:timeupdate={() => currentTime = audioElement.currentTime}
  on:loadedmetadata={() => duration = audioElement.duration}
></audio>

<input
  type="file"
  multiple
  accept="audio/*"
  style="display: none;"
  bind:this={fileInput}
  on:change={handleFileSelect}
/>
<div class="player-widget">
  <div class="disc-container" on:click={() => fileInput.click()} title="Click to add tracks to Queue">
    <div class="disc" class:spinning={isPlaying} class:paused={!isPlaying}>
      <div class="disc-spokes"></div>
      <div class="disc-center"></div>
    </div>
  </div>

  <div class="player-info">
    <div class="track-controls">
      <span class="icon" on:click={togglePlay}>
        {isPlaying ? '▶' : '■'}
      </span>
      <span class="track-name">
        <span>{tracks[currentTrackIndex]?.name || "NO DISC INSERTED"}</span>
      </span>
    </div>

    <div class="volume-control">
      <span class="vol-icon">V</span>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        bind:value={volume} 
        class="vol-slider"
      />
    </div>

    <div class="queue-info">
      Queue: {tracks.length} track(s)
    </div>
  </div>
</div>


<style>
.player-widget {
  width: 220px;
  margin-top: auto;
  background: var(--page-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  backdrop-filter: blur(8px);
  transition: background 0.4s ease, border-color 0.4s ease;
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
}

/* ============================
   DISC DESIGN (rmpc / Nier style) 
   ============================ */
.disc-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 10px 0;
}

.disc {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid var(--text-muted);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: repeating-radial-gradient(
    transparent,
    transparent 4px,
    var(--border-color) 5px,
    var(--border-color) 6px
  );
  transition: border-color 0.4s ease;
}

.disc-spokes {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: 
    linear-gradient(0deg, transparent 49%, var(--border-color) 49%, var(--border-color) 51%, transparent 51%),
    linear-gradient(90deg, transparent 49%, var(--border-color) 49%, var(--border-color) 51%, transparent 51%),
    linear-gradient(45deg, transparent 49%, var(--border-color) 49%, var(--border-color) 51%, transparent 51%),
    linear-gradient(-45deg, transparent 49%, var(--border-color) 49%, var(--border-color) 51%, transparent 51%);
  opacity: 0.5;
}

.disc-center {
  width: 32px;
  height: 32px;
  background: var(--page-bg);
  border: 2px solid var(--text-muted);
  border-radius: 50%;
  z-index: 2;
  position: relative;
}

.disc-center::after {
  content: '';
  position: absolute;
  top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 6px; height: 6px;
  background: var(--text-main);
  border-radius: 50%;
}

/* SPIN ANIMATION */
.spinning {
  animation: spin 3s linear infinite;
}
.paused {
  animation: spin 3s linear infinite;
  animation-play-state: paused;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

/* ============================
   CONTROLS 
   ============================ */
.player-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.track-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  cursor: pointer;
  font-size: 11px;
  color: var(--text-main);
}

.track-name {
  font-family: "Tw Cen MT", sans-serif;
  font-size: 13px;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  position: relative;
  width: 160px;
}

.track-name span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}


.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 18px;
  margin-top: 6px;
}

.vol-icon {
  font-size: 9px;
  font-family: "Vintage ROM", monospace;
  color: var(--text-muted);
}

.vol-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 80px;
  height: 2px;
  background: var(--border-color);
  outline: none;
  cursor: pointer;
}

.vol-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 4px;
  height: 10px;
  background: var(--text-muted);
  cursor: pointer;
  border-radius: 0;
  transition: background 0.2s;
}

.vol-slider::-webkit-slider-thumb:hover {
  background: var(--text-main);
}

.queue-info {
  padding-left: 18px;
  font-size: 9px;
  opacity: 0.5;
  font-family: "Vintage ROM", monospace;
  color: var(--text-muted);
  margin-top: 2px;
}
</style>