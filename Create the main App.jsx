
import { useState, useEffect } from "react";

import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Snackbar,
    Alert,
    CircularProgress
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";

import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";

import {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent
} from "./services/api";

function App() {

    // Store student records
    const [students, setStudents] = useState([]);

    // Store selected student for editing
    const [editingStudent, setEditingStudent] = useState(null);

    // Search state
    const [search, setSearch] = useState("");

    // Loading state
    const [loading, setLoading] = useState(true);

    // Notification state
    const [notification, setNotification] = useState("");

    const [error, setError] = useState("");

    // Fetch students from backend
    const fetchStudents = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getStudents();

            setStudents(response.data || []);

        } catch (err) {

            console.error(err);
            setError("Unable to load students. Check the backend.");

        } finally {

            setLoading(false);

        }
    };

    // Load students when application starts
    useEffect(() => {

        fetchStudents();

    }, []);

    // Register or update student
    const handleSubmit = async (studentData) => {

        if (editingStudent) {

            await updateStudent(editingStudent.id, studentData);

            setNotification("Student updated successfully!");

            setEditingStudent(null);

        } else {

            await createStudent(studentData);

            setNotification("Student registered successfully!");

        }

        await fetchStudents();
    };

    // Select student for editing
    const handleEdit = (student) => {

        setEditingStudent(student);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete student
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteStudent(id);

            setNotification("Student deleted successfully!");

            if (editingStudent?.id === id) {
                setEditingStudent(null);
            }

            await fetchStudents();

        } catch (err) {

            setNotification(
                err.response?.data?.error ||
                "Unable to delete student."
            );

        }
    };

    return (

        <Box sx={{ minHeight: "100vh", bgcolor: "#f4f6f9", py: 4 }}>

            <Container maxWidth="lg">

                {/* Header */}

                <Paper sx={{ p: 3, mb: 3 }} elevation={2}>

                    <Typography variant="h4" fontWeight="bold">
                        Student Management System
                    </Typography>

                    <Typography color="text.secondary">
                        Manage student records easily
                    </Typography>

                </Paper>

                {/* Dashboard Cards */}

                <Grid container spacing={3} sx={{ mb: 3 }}>

                    <Grid item xs={12} sm={6}>

                        <Card>

                            <CardContent>

                                <Box display="flex" alignItems="center" gap={2}>

                                    <SchoolIcon
                                        color="primary"
                                        fontSize="large"
                                    />

                                    <Box>

                                        <Typography color="text.secondary">
                                            Total Students
                                        </Typography>

                                        <Typography variant="h4" fontWeight="bold">
                                            {students.length}
                                        </Typography>

                                    </Box>

                                </Box>

                            </CardContent>

                        </Card>

                    </Grid>

                    <Grid item xs={12} sm={6}>

                        <Card>

                            <CardContent>

                                <Box display="flex" alignItems="center" gap={2}>

                                    <PeopleIcon
                                        color="success"
                                        fontSize="large"
                                    />

                                    <Box>

                                        <Typography color="text.secondary">
                                            Registered Records
                                        </Typography>

                                        <Typography variant="h4" fontWeight="bold">
                                            {students.length}
                                        </Typography>

                                    </Box>

                                </Box>

                            </CardContent>

                        </Card>

                    </Grid>

                </Grid>

                {/* Backend Error */}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Student Form */}

                <StudentForm
                    onSubmit={handleSubmit}
                    editingStudent={editingStudent}
                    onCancel={() => setEditingStudent(null)}
                />

                {/* Student List */}

                {loading ? (

                    <Box display="flex" justifyContent="center" p={5}>
                        <CircularProgress />
                    </Box>

                ) : (

                    <StudentList
                        students={students}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        search={search}
                        setSearch={setSearch}
                    />

                )}

                {/* Notification */}

                <Snackbar
                    open={Boolean(notification)}
                    autoHideDuration={3000}
                    onClose={() => setNotification("")}
                >

                    <Alert
                        severity="success"
                        onClose={() => setNotification("")}
                    >
                        {notification}
                    </Alert>

                </Snackbar>

            </Container>

        </Box>
    );
}

export default App;
