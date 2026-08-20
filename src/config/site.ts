export const siteConfig = {
	// Basic identity
	name: "EveryChecklist",
	tagline: "Plan life, one checkbox at a time",
	domain: "everychecklist.co",
	emoji: "✅",
	defaultDescription:
		"Practical, tested checklists for travel, camping, students and teachers, pregnancy, new moms, moving, holidays, and more. Free to read, free to print.",

	// Pagination
	articlesPerPage: 12,

	// Category display order — must match scripts/generate-from-sheet.mjs
	categoryOrder: [
		"Travel & Camping",
		"Students & Teachers",
		"Pregnancy",
		"Motherhood",
		"Weddings & Marriage",
		"Home & Moving",
		"Health & Productivity",
		"Seasonal & Holiday",
	],

	// Footer
	footerText: "All lists, no fluff. Synced automatically from Google Sheets.",
};
