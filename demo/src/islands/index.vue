<script setup lang="ts">
import { useContext } from 'astro-context/vue'
import { useTemplateRef } from 'vue'

import { LocalContext, SessionContext } from './model'

interface Props {
  variant?: 'global' | 'session' | 'local'
}
const { variant = 'local' } = defineProps<Props>()

const node = useTemplateRef('node')
const [context, setContext] = useContext(
  variant === 'session' ? SessionContext : LocalContext,
  node,
)

const onChange = (event: Event) => {
  setContext.value((event.target as HTMLInputElement).checked)
}
</script>

<template>
  <div
    :class="
      ['tile', variant === 'session' && 'context_session']
        .filter(Boolean)
        .join(' ')
    "
    ref="node"
  >
    <div class="tile__header">
      <div class="tile__icon">
        <span class="material-symbols-outlined">code_blocks</span>
      </div>
      <div
        :class="
          ['badge', variant === 'session' && 'badge_alt']
            .filter(Boolean)
            .join(' ')
        "
      ></div>
    </div>
    <div class="tile__title">Vue.js (SFC)</div>
    <div class="tile__controls">
      <label>
        <input type="checkbox" :checked="context" @change="onChange" />
        Activate
      </label>
    </div>
  </div>
</template>
