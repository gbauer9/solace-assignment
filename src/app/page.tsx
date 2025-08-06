"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdvocateResponse, AdvocateListResponse } from "@/types/advocates";
import { SortDirection, WithPagination } from "@/types/common";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<AdvocateListResponse>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Debounce the search term with 400ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const fetchAdvocates = useCallback(async (page: number = 1, size: number = 10, query?: string, sort?: string, direction?: SortDirection) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: size.toString(),
      });
      
      if (query) {
        params.append("query", query);
      }

      if (sort) {
        params.append("sortField", sort);
        params.append("sortDirection", direction ?? "asc");
      }
      
      const response = await fetch(`/api/advocates?${params.toString()}`);
      const advocatesResponse: WithPagination<AdvocateResponse> = await response.json();
      setAdvocates(advocatesResponse.items || []);
      setTotalCount(advocatesResponse.totalCount || 0);
      setCurrentPage(advocatesResponse.page || 1);
      setPageSize(advocatesResponse.pageSize || 10);
    } catch (error) {
      console.error("Error fetching advocates:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch advocates when debounced search term, sort field, or sort direction changes
  useEffect(() => {
    console.log("fetching advocates...");
    fetchAdvocates(currentPage, pageSize, debouncedSearchTerm, sortField || undefined, sortDirection);
  }, [debouncedSearchTerm, currentPage, pageSize, sortField, sortDirection, fetchAdvocates]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    // Reset to first page when searching
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    if (value === "none") {
      setSortField("");
      setSortDirection("asc");
    } else {
      const [field, direction] = value.split("-");
      setSortField(field);
      setSortDirection(direction as "asc" | "desc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find an Advocate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by name, city, degree, or experience..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1"
            />
            <Select value={sortField ? `${sortField}-${sortDirection}` : "none"} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sort by</SelectItem>
                <SelectItem value="firstName-asc">First Name (A-Z)</SelectItem>
                <SelectItem value="firstName-desc">First Name (Z-A)</SelectItem>
                <SelectItem value="lastName-asc">Last Name (A-Z)</SelectItem>
                <SelectItem value="lastName-desc">Last Name (Z-A)</SelectItem>
                <SelectItem value="city-asc">City (A-Z)</SelectItem>
                <SelectItem value="city-desc">City (Z-A)</SelectItem>
                <SelectItem value="yearsOfExperience-asc">Experience (Low to High)</SelectItem>
                <SelectItem value="yearsOfExperience-desc">Experience (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advocates Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">First Name</TableHead>
                <TableHead className="w-[120px]">Last Name</TableHead>
                <TableHead className="w-[100px]">City</TableHead>
                <TableHead className="w-[100px]">Degree</TableHead>
                <TableHead className="w-[200px]">Specialties</TableHead>
                <TableHead className="w-[140px]">Years of Experience</TableHead>
                <TableHead className="w-[140px]">Phone Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2">Loading advocates...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : advocates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No advocates found matching your search." : "No advocates found."}
                  </TableCell>
                </TableRow>
              ) : (
                advocates.map((advocate) => (
                  <TableRow key={advocate.id}>
                    <TableCell className="font-medium">{advocate.firstName}</TableCell>
                    <TableCell>{advocate.lastName}</TableCell>
                    <TableCell>{advocate.city}</TableCell>
                    <TableCell>{advocate.degree}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {Array.isArray(advocate.specialties) ? 
                          advocate.specialties.map((specialty, idx) => (
                            <div key={idx} className="text-sm bg-secondary px-2 py-1 rounded">
                              {specialty}
                            </div>
                          ))
                          : 
                          <span className="text-sm text-muted-foreground">No specialties listed</span>
                        }
                      </div>
                    </TableCell>
                    <TableCell>{advocate.yearsOfExperience}</TableCell>
                    <TableCell>{advocate.phoneNumber}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages || 1}
              </p>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || isLoading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || isLoading}
                >
                  Next
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {totalCount > 0 ? (
                <>
                  Showing {((currentPage - 1) * pageSize) + 1} to{" "}
                  {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
                </>
              ) : (
                "No results"
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
