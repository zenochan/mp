export class PageData<T>
{
  current_page = 1;
  total: number;
  last_page: number;
  data: T[] = []
}

