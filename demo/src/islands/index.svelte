<script lang="ts">
  import { useContext } from 'astro-context/svelte'
  import { onMount } from 'svelte'

  import { LocalContext, SessionContext } from './model'

  export let variant: 'global' | 'session' | 'local' = 'local'

  const Context = variant === 'session' ? SessionContext : LocalContext

  let node: HTMLDivElement | undefined
  let [context, setContext] = useContext(Context, node)
  onMount(() => {
    ;[context, setContext] = useContext(Context, node)
  })

  const onChange = (e: Event) => {
    setContext((e.currentTarget as HTMLInputElement).checked)
  }
</script>

<div
  class={['tile', variant === 'session' && 'context_session']
    .filter(Boolean)
    .join(' ')}
  bind:this={node}
>
  <div class="tile__header">
    <div class="tile__icon">
      <span class="material-symbols-outlined">code_blocks</span>
    </div>
    <div
      class={['badge', variant === 'session' && 'badge_alt']
        .filter(Boolean)
        .join(' ')}
    ></div>
  </div>
  <div class="tile__title">Svelte</div>
  <div class="tile__controls">
    <label>
      <input type="checkbox" checked={$context} on:change={onChange} />
      Activate
    </label>
  </div>
</div>
