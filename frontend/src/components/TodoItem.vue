<script setup lang="ts">
import { ref, watch } from 'vue';
import Toggle from '@vueform/toggle';
import { TrashIcon } from '@heroicons/vue/24/outline';
import { useTodo } from '@/shared/stores';

const todoStore = useTodo();
const props = defineProps<{
  todoId: string;
  todoDate: string;
  todoText: string;
  todoCompleted: boolean;
}>();

<<<<<<< HEAD
=======
const props = defineProps({
  todoDate: {
    type: String,
    required: true
  },
  todoText: {
    type: String,
    required: true
  },
  todoId: {
    type: Number,
    required: true
  },
  todoCompleted: {
    type: Boolean,
    required: true
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toggleTodoCompleted = async (id: any, completed: boolean) => {
  await todoStore.updateTodo(id, { completed: completed });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deleteTodoItem = async (id: any) => {
  await todoStore.deleteTodo(id);
};
>>>>>>> parent of 3403c0b (Merge pull request #22 from Meronada749/feature/mongo)

const emit = defineEmits(['update:todoCompleted']);

const todoCompletedLocal = ref(props.todoCompleted);

// Met à jour automatiquement si le parent change la prop
watch(
  () => props.todoCompleted,
  (newVal) => {
    todoCompletedLocal.value = newVal;
  }
);

// Toggle qui met à jour le store et le ref local
const toggleTodo = async () => {
  await todoStore.updateTodo(props.todoId, { completed: todoCompletedLocal.value });
  emit('update:todoCompleted', todoCompletedLocal.value);
};

// Supprime la todo
const deleteTodoItem = async () => {
  await todoStore.deleteTodo(props.todoId);
  // Supprime localement l’item pour éviter le rechargement

  todoStore.allTodo = todoStore.allTodo.filter(
  todo => todo.id !== props.todoId
);

};
</script>

<template>
  <div
    :class="
      todoCompletedLocal
        ? 'border-red-500 dark:border-red-700'
        : 'border-green-500 dark:border-green-700'
    "
    class="w-full flex flex-col items-center justify-between p-2 text-sm leading-6 rounded-md border-2 bg-gray-200 dark:bg-gray-700 mb-2"
  >
    <div
      class="flex items-center justify-between w-full border-b border-gray-300 dark:border-gray-600 pb-2"
    >
      <div class="flex items-center">
        <span class="w-[60px] dark:text-gray-200">Pour le :</span>
        <span class="text-sm text-gray-700 dark:text-white font-bold">
          {{
            new Date(todoDate).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }}
        </span>
      </div>
      <div class="flex flex-1 align-middle justify-end">
        <Toggle
          v-model="todoCompletedLocal"
<<<<<<< HEAD
          @change="toggleTodo"
=======
          @change="toggleTodoCompleted(todoId, todoCompletedLocal)"
>>>>>>> parent of 3403c0b (Merge pull request #22 from Meronada749/feature/mongo)
          :classes="{
            container:
              'inline-block w-[70px] rounded-full outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-30',
            toggle:
              'flex w-[68px] h-5 rounded-full relative cursor-pointer transition items-center box-content border-1 text-xs leading-none',
            toggleOn: 'bg-red-500 border-gray-400 justify-start text-gray-800',
            toggleOff: 'bg-green-500 border-gray-400 justify-end text-gray-700',
            handle: 'inline-block bg-white w-5 h-5 top-0 rounded-full absolute transition-all',
            handleOn: 'left-full transform -translate-x-full',
            handleOff: 'left-0',
            label:
              'text-gray-600 dark:text-gray-700 text-center font-bold w-8 border-box whitespace-nowrap select-none pl-1 pr-1 ml-[8px] mr-[15px]'
          }"
          data-testid="todo-toggle"
        >
          <template v-slot:label="{ checked, classList }">
            <div :class="classList.label">{{ checked ? 'Done' : 'To Do' }}</div>
          </template>
        </Toggle>
      </div>
      <div class="ml-4 flex-shrink-0">
        <button @click="deleteTodoItem">
          <TrashIcon
            class="h-5 w-5 stroke-gray-600 dark:stroke-white hover:stroke-red-500 cursor-pointer"
          />
        </button>
      </div>
    </div>
    <div
      class="flex w-full flex-1 bg-white dark:bg-gray-200 mt-[10px] ml-[10px] mr-[10px] mb-[0px] rounded-[4px]"
    >
      <div class="todo-html w-full text-left p-2" v-html="todoText"></div>
    </div>
  </div>
</template>

<style>
.todo-html {
  white-space: pre-wrap;
}
.todo-html ul {
  list-style: disc;
  padding-left: 1rem;
}
.todo-html > ol {
  list-style: decimal;
  padding-left: 1rem;
}
</style>
