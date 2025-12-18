import { defineStore } from 'pinia';
import type { Todo, TodoForm, TodoUpdateForm } from '../interfaces';
import { createTodo, deleteTodo, fetchAllTodo, fetchSearchTodo, updateTodo } from '../services';
import type { ResponseData } from '../helpers';

interface ResponseTodoData {
  id: number;
  date: string;
  text: string;
  completed: boolean;
  message?: string;
}

interface TodoState {
  allTodo: Todo[];
  loading: boolean;
}

export const useTodo = defineStore('todo', {
  state: (): TodoState => ({
    allTodo: [],
    loading: false
  }),

  actions: {
    // Crée un nouveau todo
    async createTodo(todoForm: TodoForm) {
      this.loading = true;
      try {
        const response = (await createTodo(todoForm)) as ResponseData;
        const todoResponse = response as unknown as ResponseTodoData;

        // fallback temporaire si id non renvoyé
        const todo: Todo = {
          id: todoResponse.id ? String(todoResponse.id) : `temp-${Date.now()}`,
          text: todoResponse.text,
          completed: todoResponse.completed,
          date: new Date(todoResponse.date)
        };

        // ajoute le todo dans le tableau réactif
        this.allTodo = [...this.allTodo, todo];

        // tri par date si nécessaire
        this.allTodo.sort((a, b) => a.date.getTime() - b.date.getTime());
      } catch (error) {
        console.error('Erreur createTodo:', error);
      } finally {
        this.loading = false;
      }
    },

    // Met à jour un todo existant
    async updateTodo(id: string, todoForm: TodoUpdateForm) {
      try {
        const response = (await updateTodo(id, todoForm)) as ResponseData;
        const todoResponse = response as unknown as ResponseTodoData;

        this.allTodo = this.allTodo.map((todo) =>
          todo.id === todoResponse.id
            ? {
                ...todo,
                text: todoResponse.text,
                completed: todoResponse.completed,
                date: new Date(todoResponse.date)
              }
            : todo
        );
      } catch (error) {
        console.error('Erreur updateTodo:', error);
      }
    },

    // Supprime un todo
    async deleteTodo(id: string) {
      try {
        const response = (await deleteTodo(id)) as ResponseData;
        const todoResponse = response as unknown as ResponseTodoData;
<<<<<<< HEAD

        this.allTodo = this.allTodo.filter((todo) => todo.id !== todoResponse.id);
      } catch (error) {
        console.error('Erreur deleteTodo:', error);
      }
=======
        if (this.allTodo) {
          // supprime le todo du tableau
          this.allTodo = this.allTodo.filter((todo) => todo.id !== Number(todoResponse.id));
        }
      });
>>>>>>> parent of 3403c0b (Merge pull request #22 from Meronada749/feature/mongo)
    },

    // Récupère tous les todos
    async fetchAllTodo() {
      this.loading = true;
      try {
        const response = await fetchAllTodo();
        const todosResponse = (response ?? []) as unknown as ResponseTodoData[];

        this.allTodo = todosResponse.map((todo) => ({
          id: String(todo.id),
          date: new Date(todo.date),
          text: todo.text,
          completed: todo.completed
        }));
      } catch (error) {
        console.error('Erreur fetchAllTodo:', error);
        this.allTodo = [];
      } finally {
        this.loading = false;
      }
    },

    // Recherche les todos par query
    async fetchSearchTodo(query: string) {
      this.loading = true;
      try {
        const todosResponse = (await fetchSearchTodo(query)) as ResponseTodoData[] | null;
        this.allTodo =
          todosResponse?.map((todo) => ({
            id: String(todo.id),
            date: new Date(todo.date),
            text: todo.text,
            completed: todo.completed
          })) ?? [];
      } catch (error) {
        console.error('Erreur fetchSearchTodo:', error);
        this.allTodo = [];
      } finally {
        this.loading = false;
      }
    }
  }
});
