"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { GetBlogs } from "@/src/services/blog.service";
import { BlogsDataTableType } from "@/src/app/types/blogType";
import { Pagination } from "@/src/app/types/userType";

import { BlogSearch } from "@/src/components/blog/search";
import { Button } from "@/src/components/ui/button";
import { BlogCard } from "@/src/components/blog/blog-card";
import { PaginationComponent } from "@/src/components/pagination/pagination";
import { SpinnerCustom } from "@/src/components/loading";
import BlogDialog from "@/src/components/dialog/blog";

type DialogType = "create" | "edit" | "";

const BlogPage = () => {
  const { data: session, status } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const [dialogType, setDialogType] = useState<DialogType>("");
  const [selectedBlog, setSelectedBlog] = useState<BlogsDataTableType | null>(
    null,
  );

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [loadingMain, setLoadingMain] = useState(false);

  const [dataTable, setDataTable] = useState<BlogsDataTableType[]>([]);

  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchBlogs = async (search = searchQuery, currentPage = page) => {
    try {
      setLoadingMain(true);

      const params = {
        page: currentPage,
        limit,
        ...(search.trim()
          ? {
              search: search.trim(),
            }
          : {}),
      };

      const res = await GetBlogs(params);

      setDataTable(res?.items?.articles ?? []);
      setPagination(res?.items?.pagination ?? null);
    } catch (error) {
      console.error("Get blogs error:", error);
    } finally {
      setLoadingMain(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchBlogs(searchQuery, 1);
  };

  const handleClear = () => {
    setSearchQuery("");
    setPage(1);
    fetchBlogs("", 1);
  };

  const handleCreate = () => {
    setSelectedBlog(null);
    setDialogType("create");
    setIsCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setDialogType("");
    setSelectedBlog(null);
  };

  const handleDialogSuccess = async () => {
    handleCloseDialog();

    await fetchBlogs(searchQuery, page);
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, limit]);

  return (
    <div className="w-full">
      <div className="mb-6 flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
          <p className="text-2xl font-semibold">Blogs</p>
          <div className="w-full sm:w-80">
            <BlogSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
          <Button onClick={handleSearch} className="w-full sm:w-auto">
            Search
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            className="w-full sm:w-auto"
          >
            Clear
          </Button>
        </div>
        <Button
          className="w-full bg-green-500 hover:bg-green-600 sm:w-auto"
          onClick={handleCreate}
        >
          Create Blog
        </Button>
      </div>
      {status === "loading" ? (
        <div className="flex min-h-160 items-center justify-center">
          <SpinnerCustom />
        </div>
      ) : loadingMain ? (
        <div className="flex min-h-160 flex-col items-center justify-center gap-3">
          <SpinnerCustom />

          <p className="text-sm text-muted-foreground">Loading blogs...</p>
        </div>
      ) : dataTable.length === 0 ? (
        <div className="flex min-h-60 items-center justify-center">
          <p className="text-sm text-muted-foreground">No blogs found.</p>
        </div>
      ) : (
        <>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dataTable.map((blog) => (
              <BlogCard
                key={blog.id}
                {...blog}
                currentUserId={session?.user?.id}
                currentUserRole={session?.user?.role}
                onUpdated={() => {
                  fetchBlogs(searchQuery, page);
                }}
                onDeleted={(id) => {
                  setDataTable((prev) => prev.filter((item) => item.id !== id));
                }}
              />
            ))}
          </div>
          {pagination && (
            <div className="mt-8 flex w-full justify-center p-4">
              <PaginationComponent
                pagination={pagination}
                page={page}
                setPage={setPage}
              />
            </div>
          )}
        </>
      )}
      <BlogDialog
        isOpen={isCreateDialogOpen}
        onClose={handleCloseDialog}
        dialogType={dialogType}
        blog={selectedBlog}
        onSuccess={handleDialogSuccess}
      />
    </div>
  );
};

export default BlogPage;
