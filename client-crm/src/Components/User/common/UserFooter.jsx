import { cn } from "../../../utils/cn";

export const UserFooter = ({ collapsed }) => {
    return (
        <div className={cn(
            "transition-all duration-300 ease-in-out",
            collapsed ? "md:ml-[70px]" : "md:ml-[230px]"
        )}>
            <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6 px-4 sm:px-6 lg:px-8 w-full">
                <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        © {new Date().getFullYear()} XD Code. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6">
                        <a
                            href="#"
                            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                            Privacy Policy (User Side)
                        </a>
                        <a
                            href="#"
                            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                            Terms of Service
                        </a>
                        <a
                            href="#"
                            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};