"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdvocateResponse, AdvocateListResponse } from "@/types/advocates";
import { WithPagination } from "@/types/common";



export default function Home() {
  const [advocates, setAdvocates] = useState<AdvocateListResponse>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<AdvocateListResponse>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdvocates = async (page: number = 1, size: number = 10) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/advocates?page=${page}&pageSize=${size}`);
      const advocatesResponse: WithPagination<AdvocateResponse> = await response.json();
      setAdvocates(advocatesResponse.items || []);
      setFilteredAdvocates(advocatesResponse.items || []);
      setTotalCount(advocatesResponse.totalCount || 0);
      setCurrentPage(advocatesResponse.page || 1);
      setPageSize(advocatesResponse.pageSize || 10);
    } catch (error) {
      console.error("Error fetching advocates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("fetching advocates...");
    fetchAdvocates(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    // If search is empty, show all advocates from current page
    if (!searchValue.trim()) {
      setFilteredAdvocates(advocates);
      return;
    }

    console.log("filtering advocates...");
    console.log("Search value:", searchValue);
    console.log("All advocates:", advocates);
    
    const filteredAdvocates = advocates.filter((advocate) => {
      const specialties = Array.isArray(advocate.specialties) ? advocate.specialties : [];
      const matches = (
        advocate.firstName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        advocate.lastName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        advocate.city?.toLowerCase().includes(searchValue.toLowerCase()) ||
        advocate.degree?.toLowerCase().includes(searchValue.toLowerCase()) ||
        specialties.some(specialty => specialty?.toLowerCase().includes(searchValue.toLowerCase()))
      );
      
      console.log(`Advocate ${advocate.firstName} ${advocate.lastName}:`, {
        firstName: advocate.firstName,
        lastName: advocate.lastName,
        city: advocate.city,
        degree: advocate.degree,
        specialties: specialties,
        matches: matches
      });
      
      return matches;
    });

    console.log("Filtered advocates:", filteredAdvocates);
    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchAdvocates(newPage, pageSize);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    fetchAdvocates(1, newPageSize);
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
              placeholder="Search by name, city, degree, specialties, or experience..."
              value={searchTerm}
              onChange={onChange}
              className="flex-1"
            />
            <Button onClick={onClick} variant="outline">
              Reset Search
            </Button>
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
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Degree</TableHead>
                <TableHead>Specialties</TableHead>
                <TableHead>Years of Experience</TableHead>
                <TableHead>Phone Number</TableHead>
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
              ) : filteredAdvocates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No advocates found matching your search." : "No advocates found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdvocates.map((advocate) => (
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
                Page {currentPage} of {totalPages}
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
