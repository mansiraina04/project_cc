export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    language?: string;
    previewLink?: string;
    infoLink?: string;
    canonicalVolumeLink?: string;
  };
  saleInfo?: {
    country?: string;
    saleability?: string;
    isEbook?: boolean;
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
    retailPrice?: {
      amount: number;
      currencyCode: string;
    };
    buyLink?: string;
  };
  accessInfo?: {
    country?: string;
    viewability?: string;
    embeddable?: boolean;
    publicDomain?: boolean;
    textToSpeechPermission?: string;
    epub?: {
      isAvailable: boolean;
      acsTokenLink?: string;
    };
    pdf?: {
      isAvailable: boolean;
      acsTokenLink?: string;
    };
    webReaderLink?: string;
    accessViewStatus?: string;
    quoteSharingAllowed?: boolean;
  };
}

export interface BookSearchResult {
  kind: string;
  totalItems: number;
  items: Book[];
}

export interface BookSearchParams {
  q: string;
  startIndex?: number;
  maxResults?: number;
  orderBy?: 'relevance' | 'newest';
  filter?: string;
  printType?: 'all' | 'books' | 'magazines';
  projection?: 'full' | 'lite';
}

export interface Favorite {
  id: string;
  dateAdded: string;
}

export interface ReadingList {
  id: string;
  name: string;
  books: string[];
  dateCreated: string;
  lastModified: string;
}

export type Genre = 
  | 'Fiction'
  | 'Non-Fiction'
  | 'Science Fiction'
  | 'Fantasy'
  | 'Mystery'
  | 'Thriller'
  | 'Romance'
  | 'Biography'
  | 'History'
  | 'Self-Help'
  | 'Business'
  | 'Science'
  | 'Technology'
  | 'Art'
  | 'Travel'
  | 'Cooking'
  | 'Poetry'
  | 'Comics'
  | 'Young Adult';