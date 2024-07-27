<template>
  <!-- Header section with background and border -->
  <v-col cols="12" class="bg-DarkPurple border h-10px"></v-col>

  <!-- Main content container -->
  <v-container color="bluy-gray-darken-3" class="d-flex text-blue-grey font-medium">
    
    <!-- Breadcrumbs for navigation -->
    <v-col cols="2">
      <v-breadcrumbs
        active-class="text-DarkPurple"
        class="text-DarkPurple d-flex flex-row-reverse text-no-wrap font-medium text-subtitle-2"
        :items="['افزودن نقش', 'لیست نقش ها']"
        
      >
        <!-- Icon for navigating back, triggers logout on click -->
        <v-icon @click="purgeAuth" size="20" class="bg-LightGray rounded-lg" icon="mdi-chevron-right"></v-icon>
      </v-breadcrumbs>

      <!-- PentagonShape component for displaying categories -->
      <v-row>
        <pentagonShape 
        ref="panelsRef"
          @selectedPanel="getSelectedCategories"
          :products="products"
        />
      </v-row>
    </v-col>

    <!-- Role and sidebar inputs section -->
    <v-col cols="5" md="3">
      <!-- Text field for entering role -->
      <v-text-field
        v-model="role"
        label="نقش"
        bg-color="LightGray"
        variant="outlined"
        density="compact"
      />
      <!-- Sidebar component for selecting categories -->
      <side-bar ref="sideBarRef" @selected-categories="getSelectedCategories" />
    </v-col>

    <!-- Section for role description and permissions -->
    <v-col cols="7">
      <v-row cols="12" class="d-flex">
        <!-- Text field for entering role description -->
        <v-col cols="5" class="text-blue-grey-darken-1">
          <v-text-field
            v-model="description"
            label="توضیحات"
            bg-color="LightGray"
            variant="outlined"
            density="compact"
          />
        </v-col>

        <!-- Switch for enabling/disabling role -->
        <v-col cols="6  d-flex" >
          <v-switch
          density="compact"
          class="mx-auto"
            color="indigo-darken-3"
          
            v-model="isActive"
            :label="isActive ? 'فعال' : 'غیرفعال'"
            hide-details
          />
        </v-col>
      </v-row>

      <!-- List of permissions grouped by categories -->
      <v-col cols="12">
        <v-list class="no-shadow text-blue-grey-darken-1">
          <v-list-group
            class="no-shadow py-1 px-3 "
            v-for="(permisonCategory, index) in categorizedActions"
            :key="index"
          >
            <!-- List item for each category -->
            <template v-slot:activator="{ props }">
              <v-row cols="12" class="overflow-hidden">
                <v-list-item
                  class="no-shadow d-flex "
                  v-bind="props"
                  min-height="10"
                  max-height="40"
                  density="compact"
                >
                  <!-- Category name displayed in list item -->
                  <v-list-item-title class="h-100 d-flex align-center">
                    {{ permisonCategory.name }}
                  </v-list-item-title>
                  <!-- Icon indicating whether category is expanded or collapsed -->
                  <template v-slot:append="{ isActive }">
                    <v-icon size="32" :icon="isActive ? 'mdi-chevron-up' : 'mdi-chevron-down'"/>
                  </template>
                </v-list-item>

                <!-- Radio group for selecting access level -->
                <v-radio-group
                  class="h-100"
                  @change="(e) => accessLevel(e, permisonCategory)"
                  inline
                >
                  <v-radio color="indigo-darken-3" label="دسترسی مشاهده" :value="300"/>
                  <v-radio color="indigo-darken-3" label="دسترسی ویرایش" :value="200"/>
                  <v-radio color="indigo-darken-3" label="دسترسی انتشار" :value="100"/>
                </v-radio-group>
              </v-row>
            </template>

            <!-- List of actions for the current category -->
            <v-col cols="12" class="d-flex flex-wrap">
              <v-list-item
                v-for="permisson in permisonCategory.actions"
                :key="permisson._id"
              >
                <v-checkbox :label="permisson.name" :value="permisson._id">
                  <!-- Custom checkbox icon -->
                  <template v-slot:input="{ isChecked }">
                    <v-icon
                      :icon="isChecked ? 'mdi-checkbox-blank-circle-outline' : 'mdi-checkbox-blank-circle'"
                      size="8"
                    />
                  </template>
                </v-checkbox>
              </v-list-item>
            </v-col>
          </v-list-group>
        </v-list>
      </v-col>

      <!-- Buttons for submitting the role or going back -->
      <v-row>
        <v-col cols="12" class="d-flex flex-row-reverse justify-start ga-1  mt-4">
          <v-btn @click="submitRole"  color="DarkPurple" class="mr-2 px-6">ثبت</v-btn>
          <v-btn outlined class="elevation-0 border-md text-blue-grey-darken-1" >بازگشت</v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script setup>
import PentagonShape from '@/components/PentagonShape.vue';
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import SideBar from '@/components/SideBar.vue';
import actions from '../assets/jsonFiles/actions.json';
import products from '../assets/jsonFiles/products.json';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { useRouter } from 'vue-router';
import { createToaster } from "@meforma/vue-toaster";

const authStore = useAuthStore();
const router = useRouter();

const categorizedActions = ref([]);
const selectedPermissons = ref([]);
const isCategories = ref(false);
const role = ref('');
const description = ref('');
const isActive = ref(false);
const selectedCategories = ref([]);
const sideBarRef = ref(null)
const panelsRef = ref(null)
// Extracts action IDs from the given categories.

function extractActionIds(data) {
  return data.flatMap(category =>
    category.actions.map(action => action._id)
  );
}

// Handles the event when categories are selected.

function getSelectedCategories(categories, type) {
  isCategories.value = type === 'panel';
  selectedCategories.value = categories;
  createCategoriesTree();
}

//  Handles the change in access level for a category.
function accessLevel(e, category) {
  selectedCategories.value.forEach(selectedCategory => {
    if (selectedCategory.id === category.id) {
      selectedPermissons.value.push({
        id: selectedCategory.id,
        name: selectedCategory.name,
        level: e.target.value,
      });
    }
  });
}

// Combines two arrays and removes duplicates.

function combineUniqueArrays(array1, array2) {
  return [...new Set([...array1, ...array2])];
}

class RolePermission {
  constructor() {
    this.values = [];
  }

  // Filters actions based on category and access level.

  filterActions(actions, category, level) {
    return actions.filter(action =>
      isCategories.value
        ? action.product._id === category.id && action.level >= level
        : action.category === category.id && action.level >= level
    );
  }

  // Updates or adds a category with new actions.

  updateOrAddCategory(actions, category, level) {
    const filteredActions = this.filterActions(actions, category, level);
    const existingCategoryIndex = this.values.findIndex(item => item.categoryId === category.id);

    if (existingCategoryIndex !== -1) {
      this.values[existingCategoryIndex].actions = filteredActions;
    } else {
      this.values.push({ categoryId: category.id, actions: filteredActions });
    }
  }

  // Retrieves the current values of role permissions.
  
  getValues() {
    return this.values;
  }

  // Clears all values and selected permissions.
  
  clearValues() {
    this.values = [];
    selectedPermissons.value = [];
  }
}

const rolePermission = new RolePermission();

class RoleObjectConstructor {
  constructor(name, description, active, actionIds) {
    this.name = name;
    this.description = description;
    this.active = active;
    this.actionIds = actionIds;
  }
}

// Submits the role by creating a new role object and showing a confirmation alert.

function submitRole() {
 
  selectedPermissons.value.forEach(permison => {
    if (permison) {
      rolePermission.updateOrAddCategory(actions, permison, permison.level);
    }
  });

  const actionIds = combineUniqueArrays(
    [],
    extractActionIds(rolePermission.getValues())
  );
  if (role.value == '') {
const toaster = createToaster({});
    toaster.show("فیلد نقش الزامی است", {
      type: "error",
  });
  return
  }
  if (!actionIds.length>0) {
const toaster = createToaster({});
    toaster.show("دسترسی برای این نقش ثبت نشده است", {
      type: "error",
  });
  return
  }
  

  const newRole = new RoleObjectConstructor(
    role.value,
    description.value,
    isActive.value,
    actionIds
  );

  Swal.fire({
    title: `نقش ${role.value} در حال ایجاد است`,
    text: `دسترسی های ثبت شده: ${actionIds}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'تایید',
    showLoaderOnConfirm: true,
    cancelButtonText: 'ویراش',
    confirmButtonColor: '#9999ff',
    denyButtonColor: '#ffff66',
    customClass: 'text-indigo-darken-3'
  }).then(result => {
    if (result.isConfirmed) {
      console.log('newRole', newRole);
      rolePermission.clearValues();
      if (sideBarRef.value) {
        sideBarRef.value.clearSelectedValue();
  }
  if (panelsRef.value) {
    panelsRef.value.clearSelectedValue();
  }
    }
  });
}

// Creates the categories tree based on selected categories.

async function createCategoriesTree() {
  categorizedActions.value = selectedCategories.value.map(category => {
    const relatedActions = isCategories.value
      ? actions.filter(action => action.product._id === category.id)
      : actions.filter(action => action.category === category.id);

    return {
      name: category.name,
      id: category.id,
      actions: relatedActions
    };
  });


}

// Logs out the user and redirects to the login page.
function purgeAuth() {
  authStore.logout();
  router.push({ path: '/login' });
}
</script>

<style scoped>
.purple-background {
  background-color: #4a148c;
}
.mdi,
.v-icon,
.mdi-checkbox-blank-circle,
.mdi-checkbox-blank-circle-outline,
.v-icon--size-default {
  height: 5px;
  width: 5px;
  font-size: 5px; 
}
</style>
