export type SwapDatesWithStrings<T> = {
	[k in keyof T]: T[k] extends Date | undefined
		? string
		: T[k] extends object
			? SwapDatesWithStrings<T[k]>
			: T[k];
};

export type Returned<T> = {
	[k in keyof T]: T[k] extends Date | undefined
		? string
		: T[k] extends object
			? SwapDatesWithStrings<T[k]>
			: T[k];
};
