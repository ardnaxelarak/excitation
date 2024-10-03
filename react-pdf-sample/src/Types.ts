export type Action =
  | {
      type: "startNewCitation";
    }
  | {
      type: "endNewCitation";
    }
  | {
      type: "gotoCitation";
      citationIndex?: number; // if undefined, choose the first one with unreviewed status. If none, keep current citation.
    }
  | {
      type: "prevQuestion";
    }
  | {
      type: "nextQuestion";
    }
  | {
      type: "prevPage";
    }
  | {
      type: "nextPage";
    }
  | {
      type: "gotoPage";
      pageNumber: number;
    }
  | {
      type: "gotoDoc";
      docIndex: number;
    }
  | {
      type: "setSelectedText";
      selectedText: string;
    }
  | {
      type: "addSelection";
    }
  | {
      type: "toggleReviewStatus";
      citationIndex: number;
      target: ReviewIcon;
    };

export interface CitationHighlight {
  pageNumber: number;
  polygons: number[][];
}

interface BaseState {
  questionIndex: number;
  newCitation: boolean;
  docIndex: number;
  pageNumber: number;
}

export interface NewCitationState extends BaseState {
  newCitation: true;
  selectedText: string;
}

export interface NoCitationsState extends BaseState {
  newCitation: false;
  citationIndex: undefined;
}

export interface CitationState extends BaseState {
  newCitation: false;
  citationIndex: number;
  citationHighlights: CitationHighlight[];
};

export type NotNewCitationStates = NoCitationsState | CitationState;
export type UXState = NewCitationState | NotNewCitationStates

export enum ReviewStatus {
  Unreviewed,
  Approved,
  Rejected,
}

// We kind of abuse the ReviewStatus enum here by overloading its values to refer both
// to the type of the citation icon (approved, rejected) and to the status of
// said citation, reflected in said icon.

export type ReviewIcon = ReviewStatus.Approved | ReviewStatus.Rejected;

export interface Doc {
  filename: string;
  friendlyname?: string;
  pages: number;
  response?: DocumentIntelligenceResponse;
}

export interface Citation {
  excerpt: string;
  docIndex: number;
  reviewStatus: ReviewStatus;
  boundingRegions?: BoundingRegion[];
}

export interface DocumentIntelligenceResponse {
  status: string;
  createdDateTime: string;
  lastUpdatedDateTime: string;
  analyzeResult: AnalyzeResult;
}

interface AnalyzeResult {
  apiVersion: string;
  modelId: string;
  stringIndexType: string;
  content: string;
  pages: Page[];
  tables: Table[];
  paragraphs: Paragraph[];
  styles: Style[];
  contentFormat: string;
  sections: Section[];
  figures: Figure[];
}

interface Figure {
  id: string;
  boundingRegions: BoundingRegion[];
  spans: Span[];
  elements: string[];
  caption: Caption;
}

interface Section {
  spans: Span[];
  elements: string[];
}

interface Style {
  confidence: number;
  spans: Span[];
  isHandwritten: boolean;
}

interface Paragraph {
  spans: Span[];
  boundingRegions: BoundingRegion[];
  role?: string;
  content: string;
}

interface Table {
  rowCount: number;
  columnCount: number;
  cells: Cell[];
  boundingRegions: BoundingRegion[];
  spans: Span[];
  caption: Caption;
}

interface Caption {
  content: string;
  boundingRegions: BoundingRegion[];
  spans: Span[];
  elements: string[];
}

interface Cell {
  rowIndex: number;
  columnIndex: number;
  content: string;
  boundingRegions: BoundingRegion[];
  spans: (Span | Span)[];
  elements?: string[];
  columnSpan?: number;
  kind?: string;
}

export interface BoundingRegion {
  pageNumber: number;
  polygon: number[];
}

interface Page {
  pageNumber: number;
  angle: number;
  width: number;
  height: number;
  unit: string;
  words: Word[];
  lines: Line[];
  spans: Span[];
  selectionMarks?: SelectionMark[];
}

interface SelectionMark {
  state: string;
  polygon: number[];
  confidence: number;
  span: Span;
}

interface Line {
  content: string;
  polygon: number[];
  spans: Span[];
}

interface Word {
  content: string;
  polygon: number[];
  confidence: number;
  span: Span;
}

interface Span {
  offset: number;
  length: number;
}

export type Event =
  | {
    type: "addCitation";
    formId: number;
    questionId: number;
    documentId: number;
    excerpt: string;
    bounds: BoundingRegion[];
    review: ReviewStatus;
    creator: string;
  }
  | {
    type: "updateReview";
    citationId: number;
    review: ReviewStatus;
    creator: string;
  }
  | {
    type: "updateBounds";
    citationId: number;
    bounds: BoundingRegion[];
    creator: string;
  };
