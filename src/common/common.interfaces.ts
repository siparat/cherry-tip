export interface IPaginationParams {
	take?: number;
	skip?: number;
}

export enum MimeTypeCategory {
	Application = 'application',
	Audio = 'audio',
	Example = 'example',
	Image = 'image',
	Message = 'message',
	Model = 'model',
	Multipart = 'multipart',
	Text = 'text',
	Video = 'video'
}

export type ErrorsType = Record<string, { ru: string; en: string }>;
