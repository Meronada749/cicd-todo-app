<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { useTodo } from '@/shared/stores';
import TodoItem from '@/components/TodoItem.vue';
import AppSpinner from '@/components/AppSpinner.vue';
import type { Todo } from '@/shared/interfaces';

const todoStore = useTodo();
const { allTodo, loading } = storeToRefs(todoStore);

const query = ref('');

// Charger les todos au montage
onMounted(async () => {
  await todoStore.fetchAllTodo();
});

// Recherche locale sur allTodo
const filteredTodos = ref<Todo[]>([]);

// Watch sur query et allTodo pour mettre à jour filteredTodos automatiquement
watch([query, allTodo], () => {
  if (!query.value.trim()) {
    filteredTodos.value = allTodo.value;
  } else {
    const q = query.value.trim().toLowerCase();
    filteredTodos.value = allTodo.value.filter(todo =>
      todo.text.toLowerCase().includes(q)
    );
  }
}, { immediate: true });

const clearSearchTodo = () => {
  query.value = '';
};
</script>

<template>
  <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Mes tâches
        </h1>
        <form class="w-2/3" @submit.prevent>
          <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input
              v-model="query"
              type="text"
              placeholder="Rechercher ..."
              class="w-full border text-md rounded-lg pl-8 pr-8 py-2 block bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-700 dark:focus:border-blue-700"
              data-testid="search-input"
            />
            <button
              type="button"
              @click="clearSearchTodo"
              class="close-button absolute top-[.3rem] right-2 size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-primary-700 dark:focus:bg-primary-700"
            >
              ✕
            </button>
          </div>
        </form>
      </div>

      <template v-if="loading">
        <AppSpinner class="w-8 h-8"/>
      </template>
      <template v-else>
        <ul role="list" class="mt-2 flex flex-col list-none" data-testid="todo-list">
          <li v-for="todo in filteredTodos" :key="todo.id">
            <TodoItem
              :todoId="Number(todo.id)"
              :todoDate="todo.date.toString()"
              :todoCompleted="todo.completed"
              :todoText="todo.text"
              data-testid="todo-item"
            />
          </li>
          <li
            class="flex items-center justify-between py-4 pr-5 text-md text-grey-900 dark:text-white leading-6"
            v-if="filteredTodos.length === 0"
          >
            Aucune tâche ...
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<style scoped>
.close-button svg {
  width: 0.8rem;
  height: 0.8rem;
}
</style>
