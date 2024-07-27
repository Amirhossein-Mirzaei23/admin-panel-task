<template>
  <!-- Main card container with custom classes for styling -->
  <v-card class="bg-LightGray font-medium border-sm">
    <v-col>
      <!-- Text field for searching category titles -->
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        label="جستجوی عنوان دسته‌بندی"
        variant="underlined"
        v-model="SearchCategory"
        class="text-field-transparent font-light text-subtitle-2"
      ></v-text-field>
      <!-- List container for displaying category tree -->
      <v-list class="no-shadow bg-LightGray font-medium text-h6">
        <!-- Loop through the categories tree -->
        <template v-for="(parenCategory, index) in categoriesTree" :key="index">
          <!-- Group for parent category with children -->
          <v-list-group class="no-shadow bg-LightGray h-25" v-if="parenCategory.children.length>0">
            <template v-slot:activator="{ props }">
              <v-list-item class="no-shadow" v-bind="props">
                <!-- Checkbox for parent category -->
                <v-checkbox
                  class="text-blue-grey-darken-1"
                  v-model="selectedCategories"
                  :label="parenCategory.name"
                  :value="parenCategory.id"
                ></v-checkbox>
              </v-list-item>
              <div class="border-b-sm"></div>
            </template>
            <!-- Loop through child categories -->
            <template v-for="childCategory in parenCategory.children" :key="childCategory">
              <v-list-group v-if="childCategory.children.length>0">
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props">
                    <!-- Checkbox for child category with children -->
                    <v-checkbox
                      class="text-blue-grey-darken-1"
                      v-model="selectedCategories"
                      :label="childCategory.name"
                      :value="childCategory.id"
                    ></v-checkbox>
                  </v-list-item>
                  <div class="border-b-sm"></div>
                </template>
                <!-- Loop through grandchild categories -->
                <v-list-item v-for="grandChildCategory in childCategory.children" :key="grandChildCategory">
                  <!-- Checkbox for grandchild category -->
                  <v-checkbox
                    class="text-blue-grey-darken-1"
                    v-model="selectedCategories"
                    :label="grandChildCategory.name"
                    :value="grandChildCategory.id"
                  ></v-checkbox>
                </v-list-item>
              </v-list-group>
              <!-- Checkbox for child category without children -->
              <template v-else>
                <v-list-item>
                  <v-checkbox
                    class="text-blue-grey-darken-1"
                    v-model="selectedCategories"
                    :label="childCategory.name"
                    :value="childCategory.id"
                  ></v-checkbox>
                </v-list-item>
                <div class="border-b-sm"></div>
              </template>
            </template>
          </v-list-group>
          <!-- Checkbox for parent category without children -->
          <template v-else>
            <v-list-item>
              <v-checkbox
                class="text-blue-grey-darken-1"
                v-model="selectedCategories"
                :label="parenCategory.name"
                :value="parenCategory.id"
              ></v-checkbox>
            </v-list-item>
            <div class="border-b-sm"></div>
          </template>
        </template>
      </v-list>
    </v-col>
  </v-card>
</template>

<script setup>
import { ref, watch, defineEmits,defineExpose } from 'vue';
import categoriesTree from '../assets/jsonFiles/categoriesTree.json';

// reactive variable for storing selected categories
const selectedCategories = ref([]);
// emit event to parent component
const emit = defineEmits(['selectedCategories']);

// reactive variable for storing search input
const SearchCategory = ref('');

// recursion function to extract category names and ids
let categories = [];

function extractNames(categoriesTree) {
  categories = [];

  function traverse(node) {
    if (node.name) {
      categories.push({ name: node.name, id: node.id });
    }
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => traverse(child));
    }
  }

  categoriesTree.forEach(item => traverse(item));

}
extractNames(categoriesTree);

// reactive variable for storing filtered categories
const emitedCAtegories = ref();

// function to filter categories based on selected ids
function filterCategories(selectedCategories) {
  emitedCAtegories.value = categories.filter(category =>
    selectedCategories.includes(category.id)
  );
}

// watcher to update filtered categories and emit event on selection change
watch(
  () => selectedCategories.value,
  () => {
    filterCategories(selectedCategories.value, categories);
   
    emit('selectedCategories', emitedCAtegories.value, 'categories');
  }
);
// function to clear selected categories after submitrole in addrole page
function clearSelectedValue(){
  selectedCategories.value = []
}
defineExpose({ clearSelectedValue });



</script>

<style scoped>
.v-navigation-drawer {
  background: white;
}

.no-shadow {
  box-shadow: none !important;
  border: 0px !important;
}
</style>
