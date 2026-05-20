<script lang="ts">
  import { pin1Store, pin2Store } from "$lib/system/appStore";

  function handleUpload(event: Event, store: any) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    
    // FIX: Instant memory link instead of heavy Base64 conversion!
    // This stops the app from freezing.
    const objectUrl = URL.createObjectURL(file);
    store.set(objectUrl);
  }
</script>

<div class="pins">
  <input type="file" id="hidden-img-upload-1" accept="image/jpeg, image/png, image/webp" style="display: none;" on:change={(e) => handleUpload(e, pin1Store)} />
  <input type="file" id="hidden-img-upload-2" accept="image/jpeg, image/png, image/webp" style="display: none;" on:change={(e) => handleUpload(e, pin2Store)} />

  <button 
    type="button"
    class="placeholder" 
    class:has-image={$pin1Store}
    on:click={() => document.getElementById('hidden-img-upload-1')?.click()}
    style:background-image={$pin1Store ? `url(${$pin1Store})` : null}
    title="Click to load image (JPG, PNG)"
  >
    {!$pin1Store ? 'Reference Image 1' : ''}
  </button>

  <button 
    type="button"
    class="placeholder" 
    class:has-image={$pin2Store}
    on:click={() => document.getElementById('hidden-img-upload-2')?.click()}
    style:background-image={$pin2Store ? `url(${$pin2Store})` : null}
    title="Click to load image (JPG, PNG)"
  >
    {!$pin2Store ? 'Reference Image 2' : ''}
  </button>
</div>

<style>
.pins {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 34px;
}

/* Updated to strip native button styles and keep your UI design */
.placeholder {
  appearance: none;
  outline: none;
  width: 220px;
  height: 190px;
  background: var(--page-bg);
  color: var(--text-muted);
  backdrop-filter: blur(8px);
  border: 1px dashed var(--border-color);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 38px;
  font-size: 14px;
  font-family: "Tw Cen MT", serif;
  border-radius: 18px;
  transition: transform 0.25s ease, background 0.4s ease, border-color 0.4s ease, color 0.4s ease;
  cursor: pointer; 
}

.placeholder:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
  border-color: var(--text-main); 
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
}

.has-image {
  background-size: cover;
  background-position: center;
  border: none !important;
  color: transparent !important;
}
</style>