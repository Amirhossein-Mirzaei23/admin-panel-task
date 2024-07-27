<template>
  <!-- loop through each product in props.products  -->
  <v-col cols="12" v-for="panel in props.products" :key="panel">
    <div class="pentagon">
      <!-- create a checkbox for each product, binding its value to selectedPanel array -->
      <v-checkbox
        class="text text-DarkPurple no-icon"
        v-model="selectedPanel"
        :label="panel.name"
        :value="{ id: panel._id, name: panel.name }">
      </v-checkbox>
    </div>
  </v-col>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, defineExpose } from "vue";

// define component props
const props = defineProps(['products']);

// define emits for emitting events
const emit = defineEmits(['selectedPanel']);

// create a reactive variable to store selected panels
const selectedPanel = ref([]);

// watch for changes in selectedPanel and emit the changes
watch(() => selectedPanel.value, () => {
  emit('selectedPanel', selectedPanel.value, 'panel');
});

// function to clear the selected value
function clearSelectedValue() {
  selectedPanel.value = [];
}

// Expose the clearSelectedValue function to parent components
defineExpose({ clearSelectedValue });
</script>

<style scoped>
/* style for the pentagon-shaped checkbox container */
.pentagon {
  width: 100px;
  height: 35px;
  position: relative;
}

.pentagon::before {
  background-color: #e6e6ff;
  content: '';
  position: absolute;
  rotate: -90deg;
  right: 0;
  width: 50px;
  transform: translate(0%, -40%);
  height: 150px;
  clip-path: polygon(50% 0%, 100% 18%, 100% 100%, 0% 100%, 0% 18%);
}

.text {
  position: absolute;
  transform: translate(-60%, 120%);
  z-index: 20;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  text-align: center;
  font-size: 14px;
}
</style>
