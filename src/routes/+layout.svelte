<script lang="ts">

  import "$lib/styles/theme.css";
  import "$lib/styles/fonts.css";

  import {
    onMount
  }
  from "svelte";

  import {
    initializeInputController
  }
  from "$lib/system/inputController";

  onMount(() => {

    initializeInputController();
  });

</script>

<slot />