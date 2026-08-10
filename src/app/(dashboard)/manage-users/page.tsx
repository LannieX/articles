"use client";

import { GetUser } from "@/src/services/user.service";
import { Pagination, User } from "@/src/app/types/userType";
import { BlogSearch } from "@/src/components/blog/search";
import { SpinnerCustom } from "@/src/components/loading";
import { PaginationComponent } from "@/src/components/pagination/pagination";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { EditIcon, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDate } from "@/src/lib/utils";
import UserDialog from "@/src/components/dialog/user";

const ManageUserPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [type, setType] = useState<"view" | "edit">("view");
  const [isOpen, setIsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMain, setLoadingMain] = useState(false);

  const [dataTable, setDataTable] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchUsers = async (search = searchQuery, currentPage = page) => {
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

      const res = await GetUser(params);

      setDataTable(res?.items?.users ?? []);
      setPagination(res?.items?.pagination ?? null);
    } catch (error) {
      console.error("Get users error:", error);
    } finally {
      setLoadingMain(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchUsers(searchQuery, 1);
  };

  const handleClear = () => {
    setSearchQuery("");
    setPage(1);
    fetchUsers("", 1);
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  const handleSuccess = async () => {
    handleCloseDialog();
    await fetchUsers("", 1);
  };

    useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Manage Users</h1>
      </div>
      <div className="mb-6 flex w-full flex-col gap-2 sm:flex-row sm:items-center">
        <div className="w-full sm:w-auto sm:min-w-70 sm:max-w-md">
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingMain ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <SpinnerCustom />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : dataTable.length > 0 ? (
              dataTable.map((x) => (
                <TableRow key={x.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setSelectedUser(x);
                          setType("view");
                          setIsOpen(true);
                        }}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setSelectedUser(x);
                          setType("edit");
                          setIsOpen(true);
                        }}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{x?.userName ?? "-"}</TableCell>
                  <TableCell>{x?.email ?? "-"}</TableCell>
                  <TableCell>{formatDate(x?.createdAt ?? "-")}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        x.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {x.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  Data not found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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

      <UserDialog
        isOpen={isOpen}
        onClose={handleCloseDialog}
        type={type}
        user={selectedUser}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ManageUserPage;
