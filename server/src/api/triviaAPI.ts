const API = {
  categories: "https://opentdb.com/api_category.php",
  questionsCount: "https://opentdb.com/api_count.php?category=",
  questionsCountGlobal: "https://opentdb.com/api_count_global.php",
};

export type CategoryType = {
  id: number;
  name: string;
}[];

export type QuestionsCountType = {
  category_id: number;
  category_question_count: {
    total_question_count: number;
    total_easy_question_count: number;
    total_medium_question_count: number;
    total_hard_question_count: number;
  };
};

export type QuestionsCountGlobalType = {
  overall: {
    total_num_of_questions: number;
    total_num_of_pending_questions: number;
    total_num_of_verified_questions: number;
    total_num_of_rejected_questions: number;
  };
  categories: {
    [key: string]: {
      total_num_of_questions: number;
      total_num_of_pending_questions: number;
      total_num_of_verified_questions: number;
      total_num_of_rejected_questions: number;
    };
  };
};

type CategoriesDataType = {
  trivia_categories: CategoryType[];
};

export async function getCategories() {
  const response: Response = await fetch(API.categories);
  const data: CategoriesDataType = await response.json();
  return data.trivia_categories;
}

export async function getQuestionsCountByCategory(id: number) {
  const response: Response = await fetch(API.questionsCount + id);
  const data: QuestionsCountType = await response.json();
  return data;
}

export async function getQuestionsCountGlobal() {
  const response: Response = await fetch(API.questionsCountGlobal);
  const data: QuestionsCountGlobalType = await response.json();
  return data;
}
