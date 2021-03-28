var documenterSearchIndex = {"docs":
[{"location":"symbolic_tutorials/mol_heat/#Solving-the-Heat-Equation","page":"Solving the Heat Equation","title":"Solving the Heat Equation","text":"","category":"section"},{"location":"symbolic_tutorials/mol_heat/#Note:-This-uses-a-currently-unreleased-interface-that-is-still-a-work-in-progress.-Use-at-your-own-risk!","page":"Solving the Heat Equation","title":"Note: This uses a currently unreleased interface that is still a work in progress. Use at your own risk!","text":"","category":"section"},{"location":"symbolic_tutorials/mol_heat/","page":"Solving the Heat Equation","title":"Solving the Heat Equation","text":"In this tutorial we will use the symbolic interface to solve the heat equation.","category":"page"},{"location":"symbolic_tutorials/mol_heat/#Dirichlet-boundary-conditions","page":"Solving the Heat Equation","title":"Dirichlet boundary conditions","text":"","category":"section"},{"location":"symbolic_tutorials/mol_heat/","page":"Solving the Heat Equation","title":"Solving the Heat Equation","text":"using OrdinaryDiffEq, ModelingToolkit, DiffEqOperators\n# Method of Manufactured Solutions: exact solution\nu_exact = (x,t) -> exp.(-t) * cos.(x)\n\n# Parameters, variables, and derivatives\n@parameters t x\n@variables u(..)\nDt = Differential(t)\nDxx = Differential(x)^2\n\n# 1D PDE and boundary conditions\neq  = Dt(u(t,x)) ~ Dxx(u(t,x))\nbcs = [u(0,x) ~ cos(x),\n        u(t,0) ~ exp(-t),\n        u(t,1) ~ exp(-t) * cos(1)]\n\n# Space and time domains\ndomains = [t ∈ IntervalDomain(0.0,1.0),\n           x ∈ IntervalDomain(0.0,1.0)]\n\n# PDE system\npdesys = PDESystem(eq,bcs,domains,[t,x],[u(t,x)])\n\n# Method of lines discretization\ndx = 0.1\norder = 2\ndiscretization = MOLFiniteDifference([x=>dx],t)\n\n# Convert the PDE problem into an ODE problem\nprob = discretize(pdesys,discretization)\n\n# Solve ODE problem\nusing OrdinaryDiffEq\nsol = solve(prob,Tsit5(),saveat=0.2)\n\n# Plot results and compare with exact solution\nx = (0:dx:1)[2:end-1]\nt = sol.t\n\nusing Plots\nplt = plot()\n\nfor i in 1:length(t)\n    plot!(x,sol.u[i],label=\"Numerical, t=$(t[i])\")\n    scatter!(x, u_exact(x, t[i]),label=\"Exact, t=$(t[i])\")\nend\ndisplay(plt)\nsavefig(\"plot.png\")","category":"page"},{"location":"symbolic_tutorials/mol_heat/#Neumann-boundary-conditions","page":"Solving the Heat Equation","title":"Neumann boundary conditions","text":"","category":"section"},{"location":"symbolic_tutorials/mol_heat/","page":"Solving the Heat Equation","title":"Solving the Heat Equation","text":"using OrdinaryDiffEq, ModelingToolkit, DiffEqOperators\n# Method of Manufactured Solutions: exact solution\nu_exact = (x,t) -> exp.(-t) * cos.(x)\n\n# Parameters, variables, and derivatives\n@parameters t x\n@variables u(..)\nDt = Differential(t)\nDx = Differential(x)\nDxx = Differential(x)^2\n\n# 1D PDE and boundary conditions\neq  = Dt(u(t,x)) ~ Dxx(u(t,x))\nbcs = [u(0,x) ~ cos(x),\n        Dx(u(t,0)) ~ 0.0,\n        Dx(u(t,1)) ~ -exp(-t) * sin(1)]\n\n# Space and time domains\ndomains = [t ∈ IntervalDomain(0.0,1.0),\n        x ∈ IntervalDomain(0.0,1.0)]\n\n# PDE system\npdesys = PDESystem(eq,bcs,domains,[t,x],[u(t,x)])\n\n# Method of lines discretization\n# Need a small dx here for accuracy\ndx = 0.01\norder = 2\ndiscretization = MOLFiniteDifference([x=>dx],t)\n\n# Convert the PDE problem into an ODE problem\nprob = discretize(pdesys,discretization)\n\n# Solve ODE problem\nusing OrdinaryDiffEq\nsol = solve(prob,Tsit5(),saveat=0.2)\n\n# Plot results and compare with exact solution\nx = (0:dx:1)[2:end-1]\nt = sol.t\n\nusing Plots\nplt = plot()\n\nfor i in 1:length(t)\n    plot!(x,sol.u[i],label=\"Numerical, t=$(t[i])\")\n    scatter!(x, u_exact(x, t[i]),label=\"Exact, t=$(t[i])\")\nend\ndisplay(plt)\nsavefig(\"plot.png\")","category":"page"},{"location":"symbolic_tutorials/mol_heat/#Robin-boundary-conditions","page":"Solving the Heat Equation","title":"Robin boundary conditions","text":"","category":"section"},{"location":"symbolic_tutorials/mol_heat/","page":"Solving the Heat Equation","title":"Solving the Heat Equation","text":"using OrdinaryDiffEq, ModelingToolkit, DiffEqOperators\n# Method of Manufactured Solutions\nu_exact = (x,t) -> exp.(-t) * sin.(x)\n\n# Parameters, variables, and derivatives\n@parameters t x\n@variables u(..)\nDt = Differential(t)\nDx = Differential(x)\nDxx = Differential(x)^2\n\n# 1D PDE and boundary conditions\neq  = Dt(u(t,x)) ~ Dxx(u(t,x))\nbcs = [u(0,x) ~ sin(x),\n        u(t,-1.0) + 3Dx(u(t,-1.0)) ~ exp(-t) * (sin(-1.0) + 3cos(-1.0)),\n        u(t,1.0) + Dx(u(t,1.0)) ~ exp(-t) * (sin(1.0) + cos(1.0))]\n\n# Space and time domains\ndomains = [t ∈ IntervalDomain(0.0,1.0),\n        x ∈ IntervalDomain(-1.0,1.0)]\n\n# PDE system\npdesys = PDESystem(eq,bcs,domains,[t,x],[u(t,x)])\n\n# Method of lines discretization\n# Need a small dx here for accuracy\ndx = 0.05\norder = 2\ndiscretization = MOLFiniteDifference([x=>dx],t)\n\n# Convert the PDE problem into an ODE problem\nprob = discretize(pdesys,discretization)\n\n# Solve ODE problem\nusing OrdinaryDiffEq\nsol = solve(prob,Tsit5(),saveat=0.2)\n\n# Plot results and compare with exact solution\nx = (0:dx:1)[2:end-1]\nt = sol.t\n\nusing Plots\nplt = plot()\n\nfor i in 1:length(t)\n    plot!(x,sol.u[i],label=\"Numerical, t=$(t[i])\")\n    scatter!(x, u_exact(x, t[i]),label=\"Exact, t=$(t[i])\")\nend\ndisplay(plt)\nsavefig(\"plot.png\")","category":"page"},{"location":"operator_tutorials/kdv/#Solving-KdV-Solitons-with-Upwinding-Operators","page":"Solving KdV Solitons with Upwinding Operators","title":"Solving KdV Solitons with Upwinding Operators","text":"","category":"section"},{"location":"operator_tutorials/kdv/","page":"Solving KdV Solitons with Upwinding Operators","title":"Solving KdV Solitons with Upwinding Operators","text":"The KdV equation is of the form uₜ + αuuₓ + βuₓₓₓ = 0. Here we'll use α = 6, β = 1 for  simplicity of the true solution expression.","category":"page"},{"location":"operator_tutorials/kdv/#Soliton-solution-using-Upwind-Difference","page":"Solving KdV Solitons with Upwinding Operators","title":"1-Soliton solution using Upwind Difference","text":"","category":"section"},{"location":"operator_tutorials/kdv/","page":"Solving KdV Solitons with Upwinding Operators","title":"Solving KdV Solitons with Upwinding Operators","text":"The analytical expression for the single soliton case takes the form u(x,t) = (c/2)/cosh²(√c * ξ/2).","category":"page"},{"location":"operator_tutorials/kdv/","page":"Solving KdV Solitons with Upwinding Operators","title":"Solving KdV Solitons with Upwinding Operators","text":"c > 0 (wave speed) ; ξ  = x - c*t (moving coordinate)","category":"page"},{"location":"operator_tutorials/kdv/","page":"Solving KdV Solitons with Upwinding Operators","title":"Solving KdV Solitons with Upwinding Operators","text":"using Test\nusing DiffEqOperators, OrdinaryDiffEq, LinearAlgebra\n\n# Space domain and grids\nN = 21\nΔx = 1/(N-1)\nc = 1\nx = -10:Δx:10;\n\n# solution of the single forward moving wave\nϕ(x,t) = (1/2)*sech.((x .- t)/2).^2 \n\n# Discretizing the PDE at t = 0\nu0 = ϕ(x,0);\ndu = zeros(size(x)); \n\n# Declaring the Upwind operator with winding = -1 since the wave travels from left to right \nA = UpwindDifference{Float64}(1,3,Δx,length(x),-1);\n\n# Defining the ODE problem\nfunction KdV(du, u, p, t)\n\tbc = GeneralBC([0,1,-6*ϕ(-10,t),0,-1],[0,1,-6*ϕ(10,t),0,-1],Δx,3) \n\tmul!(du,A,bc*u)\nend\n\nsingle_solition = ODEProblem(KdV, u0, (0.,5.));\n\n# Solving the ODE problem \nsoln = solve(single_solition,Tsit5(),abstol=1e-6,reltol=1e-6);\n\n# Plotting the results, comparing Analytical and Numerical solutions \nusing Plots\nplot(ϕ(x,0), title  = \"Single forward moving wave\", yaxis=\"u(x,t)\", label = \"t = 0.0 (Analytic)\")\nplot!(ϕ(x,2), label = \"t = 2.0 (Analytic)\")\nplot!(soln(0.0), label = \"t = 0.0 (Numerical)\",ls = :dash)\nplot!(soln(2.0), label = \"t = 2.0 (Numerical)\",ls = :dash)","category":"page"},{"location":"operator_tutorials/kdv/","page":"Solving KdV Solitons with Upwinding Operators","title":"Solving KdV Solitons with Upwinding Operators","text":"(Image: solution_plot)","category":"page"},{"location":"operators/matrix_free_operators/#Matrix-Free-Operators","page":"Matrix-Free Operators","title":"Matrix-Free Operators","text":"","category":"section"},{"location":"operators/matrix_free_operators/","page":"Matrix-Free Operators","title":"Matrix-Free Operators","text":"MatrixFreeOperator(f::F, args::N;\n                   size=nothing, opnorm=true, ishermitian=false) where {F,N}","category":"page"},{"location":"operators/matrix_free_operators/","page":"Matrix-Free Operators","title":"Matrix-Free Operators","text":"A MatrixFreeOperator is a linear operator A*u where the action of A is explicitly defined by an in-place function f(du, u, p, t).","category":"page"},{"location":"operators/operator_overview/#Operator-Overview","page":"Operator Overview","title":"Operator Overview","text":"","category":"section"},{"location":"operators/operator_overview/","page":"Operator Overview","title":"Operator Overview","text":"The operators in DiffEqOperators.jl are instantiations of the AbstractSciMLOperator interface. This is documented in SciMLBase (add link). Thus each of the operators have the functions and traits as defined for the operator interface. In addition, the DiffEqOperators.jl operators satisfy the following properties:","category":"page"},{"location":"operators/operator_overview/","page":"Operator Overview","title":"Operator Overview","text":"Derivative * Boundary gives a GhostDerivative operator, representing a derivative operator which respects boundary conditions\nBoundary conditions generate extended vectors in a non-allocating form\nOperators can be concretized into matrices","category":"page"},{"location":"operators/operator_overview/#Operator-Compositions","page":"Operator Overview","title":"Operator Compositions","text":"","category":"section"},{"location":"operators/operator_overview/","page":"Operator Overview","title":"Operator Overview","text":"Multiplying two DiffEqOperators will build a DiffEqOperatorComposition, while adding two DiffEqOperators will build a DiffEqOperatorCombination. Multiplying a DiffEqOperator by a scalar will produce a DiffEqScaledOperator. All will inherit the appropriate action.","category":"page"},{"location":"operators/operator_overview/#Efficiency-of-Composed-Operator-Actions","page":"Operator Overview","title":"Efficiency of Composed Operator Actions","text":"","category":"section"},{"location":"operators/operator_overview/","page":"Operator Overview","title":"Operator Overview","text":"Composed operator actions utilize NNLib.jl in order to do cache-efficient convolution operations in higher-dimensional combinations.","category":"page"},{"location":"symbolic/molfinitedifference/#Symbolic-Method-of-Lines-Discretizations","page":"Symbolic Method of Lines Discretizations","title":"Symbolic Method of Lines Discretizations","text":"","category":"section"},{"location":"symbolic/molfinitedifference/#TODO","page":"Symbolic Method of Lines Discretizations","title":"TODO","text":"","category":"section"},{"location":"nonlinear_derivatives/nonlinear_diffusion/#Nonlinear-Diffusion","page":"Nonlinear Diffusion","title":"Nonlinear Diffusion","text":"","category":"section"},{"location":"nonlinear_derivatives/nonlinear_diffusion/","page":"Nonlinear Diffusion","title":"Nonlinear Diffusion","text":"This function handles expressions of the form ðₙ(D(ðₘu)) where n,m > 0 and  D is a function of u i.e. they vary as u(x,t) and D(u). The expansion can be carried out via  general Leibniz rule.","category":"page"},{"location":"nonlinear_derivatives/nonlinear_diffusion/","page":"Nonlinear Diffusion","title":"Nonlinear Diffusion","text":"A boundary condition operator bc is first operated on u resulting in a  boundary padded vector bc*u. Since D is a function of u, its discrete values  can be obtained at grid points once u has been padded.  After producing these  two functions in the grid range, we can expand the given expression via binomial expansion through the nonlinear_diffusion and  nonlinear_diffusion! functions and produce the final discretized derivatives.","category":"page"},{"location":"nonlinear_derivatives/nonlinear_diffusion/","page":"Nonlinear Diffusion","title":"Nonlinear Diffusion","text":"(Image: Expressions for general Leibnuz rule with varying m)","category":"page"},{"location":"nonlinear_derivatives/nonlinear_diffusion/","page":"Nonlinear Diffusion","title":"Nonlinear Diffusion","text":"The functions implicitly put the CenteredDifference operator  to use for computing derivates of various orders, e.g.  uᵏ = CenteredDifference(k,approx_order,dx,nknots)*u, helping us generate a symmetric discretization. The two functions differ in terms of memory allocation, since the non-! one will allocate memory to the output whereas the ! one can be used for non-allocating applications.","category":"page"},{"location":"nonlinear_derivatives/nonlinear_diffusion/#Functions","page":"Nonlinear Diffusion","title":"Functions","text":"","category":"section"},{"location":"nonlinear_derivatives/nonlinear_diffusion/","page":"Nonlinear Diffusion","title":"Nonlinear Diffusion","text":"The two functions are as follows :","category":"page"},{"location":"nonlinear_derivatives/nonlinear_diffusion/","page":"Nonlinear Diffusion","title":"Nonlinear Diffusion","text":"nonlinear_diffusion(second_differential_order::Int, first_differential_order::Int, approx_order::Int,\n                    p::AbstractVector{T}, q::AbstractVector{T}, dx::Union{T , AbstractVector{T} , Real},\n                    nknots::Int) where {T<:Real, N}\n\nnonlinear_diffusion!(du::AbstractVector{T}, second_differential_order::Int, first_differential_order::Int,\n                     approx_order::Int,p::AbstractVector{T}, q::AbstractVector{T},\n                     dx::Union{T , AbstractVector{T} , Real}, nknots::Int) where {T<:Real, N}","category":"page"},{"location":"nonlinear_derivatives/nonlinear_diffusion/","page":"Nonlinear Diffusion","title":"Nonlinear Diffusion","text":"Arguments :","category":"page"},{"location":"nonlinear_derivatives/nonlinear_diffusion/","page":"Nonlinear Diffusion","title":"Nonlinear Diffusion","text":"du : an input AbstractVector similar to u, to store the final discretized expression.\nsecond_differential_order : the overall order of derivative on the expression.(n)\nfirst_differential_order : the inner order of derivative to discretize for u.(m)\napprox_order : the order of the discretization in terms of O(dx^order).\np : boundary padded D.\nq : boundary padded u obtained by bc*u.\ndx: spacing of the discretization. If dx is a Number, the discretization       is uniform. If dx is an array, then the discretization is non-uniform.\nnknots : the length of discretization in the direction of operator.","category":"page"},{"location":"operators/derivative_operators/#Derivative-Operators","page":"Derivative Operators","title":"Derivative Operators","text":"","category":"section"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"As shown in the figure, the operators act on a set of samples f_j = f(x_j) for a function f at a grid of points x_j. The grid has n interior points at x_j = jh for j = 1 to n, and 2 boundary points at x_0 = 0 and x_{n+1} = (n+1) h. The input to the numerical operators is a vector u = [f_1, f_2, …, f_N], and they output a vector of sampled derivatives du ≈ [f'(x_1), f'(x_2), …, f'(x_N)], or a higher-order derivative as requested.","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"A numerical derivative operator D of order m can be constructed for this grid with D = CenteredDifference(1, m, h, n). The argument 1 indicates that this is the first derivative. Order m means that the operator is exact up to rounding when f is a polynomial of degree m or lower.","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"The derivative operator D is used along with a boundary condition operator Q to compute derivatives at the interior points of the grid. A simple boundary condition f(x_0) = f(x_n+1) = 0 is constructed with Q = Dirichlet0BC(eltype(u)).","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"Given these definitions, the derivatives are calculated as if the operators D and Q were matrices, du = D*Q*u. This is an abuse of notation! The particular Q in this example is a linear operator but, in general, boundary conditions are affine operators. They have the form Q(x) = M*x + c, where M is a matrix and c is a constant vector. As a consequence, Q cannot be concretized to a matrix.","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"(Image: Actions of DiffEqOperators on interior points and ghost points)","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"The operator D works by interpolating a polynomial of degree m through m+1 adjacent points on the grid. Near the middle of the grid, the derivative is approximated at x_j by interpolating a polynomial of order m with x_j at its centre. To define an order-m polynomial, values are required at m+1 points. When x_j is too close to the boundary for that to fit, the polynomial is interpolated through the leftmost or rightmost m+1 points, including two “ghost” points that Q appends on the boundaries. The numerical derivatives are linear combinations of the values through which the polynomials are interpolated. The vectors of the coefficients in these linear combinations are called “stencils”. Because D takes values at the ghost points and returns values at the interior points, it is an n×(n+2) matrix.","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"The boundary condition operator Q acts as an (n+2)×n matrix. The output Q*u is a vector of values on the n interior and the 2 boundary points, [a, f(x_1), …, f(x_N), b]. The interior points take the values of u. The values a and b are samples at “ghost” points on the grid boundaries. As shown, these values are assigned so that an interpolated polynomial P(x) satisfies the left hand boundary condition, and Q(x) satisfies the right-hand boundary condition. The boundary conditions provided by the library are precisely those for which the values a and b are affine functions of the interior values f_j, so that Q is an affine operator.","category":"page"},{"location":"operators/derivative_operators/#Higher-dimensions","page":"Derivative Operators","title":"Higher dimensions","text":"","category":"section"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"In one dimension, u is naturally stored as a Vector, and the derivative and boundary condition operators are similar to matrices.","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"In two dimensions, the values f(x_j) are naturally stored as a matrix. Taking derivatives along the downwards axis is easy, because matrices act columnwise. Horizontal derivatives can be taken by transposing the matrices. The derivative along the rightward axis is (D*F')' = F*D'. This is easy to code, but less easy to read for those who haven't seen it before.","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"When a function has three or more arguments, its values are naturally stored in a higher-dimensional array. Julia's multiplication operator is only defined for Vector and Matrix, so applying an operator matrix to these arrays would require a complicated and error prone series of reshape and axis permutation functions.","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"Therefore the types of derivative and boundary condition operators are parameterised by the axis along which the operator acts. With derivative operators, the axis is supplied as a type parameter. The simple case CenteredDifference(…) is equivalent to CenteredDifference{1}(…), row-wise derivatives are taken by CenteredDifference{2}(…), sheet-wise by CenteredDifference{3}(…), and along the Nth axis by CenteredDifference{N}(…).","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"Boundary conditions are more complicated. See @doc MultiDimBC for how they are supposed to work in multiple dimensions. They don't currently work that way.","category":"page"},{"location":"operators/derivative_operators/#Constructors","page":"Derivative Operators","title":"Constructors","text":"","category":"section"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"The constructors are as follows:","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"CenteredDifference{N}(derivative_order::Int,\n                      approximation_order::Int, dx,\n                      len::Int, coeff_func=nothing)\n\nUpwindDifference{N}(derivative_order::Int,\n                    approximation_order::Int, dx\n                    len::Int, coeff_func=nothing)","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"The arguments are:","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"N: The directional dimension of the discretization. If N is not given, it is assumed to be 1, i.e., differencing occurs along columns.\nderivative_order: the order of the derivative to discretize.\napproximation_order: the order of the discretization in terms of O(dx^order).\ndx: the spacing of the discretization. If dx is a Number, the operator is a uniform discretization. If dx is an array, then the operator is a non-uniform discretization.\nlen: the length of the discretization in the direction of the operator.\ncoeff_func: An operational argument for a coefficient function f(du,u,p,t) which sets the coefficients of the operator. If coeff_func is a Number, then the coefficients are set to be constant with that number. If coeff_func is an AbstractArray with length matching len, then the coefficients are constant but spatially dependent.","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"N-dimensional derivative operators need to act against a value of at least N dimensions.","category":"page"},{"location":"operators/derivative_operators/#Derivative-Operator-Actions","page":"Derivative Operators","title":"Derivative Operator Actions","text":"","category":"section"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"These operators are lazy, meaning the memory is not allocated. Similarly, the operator actions * can be performed without ever building the operator matrices. Additionally, mul!(y,L,x) can be performed for non-allocating applications of the operator.","category":"page"},{"location":"operators/derivative_operators/#Concretizations","page":"Derivative Operators","title":"Concretizations","text":"","category":"section"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"The following concretizations are provided:","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"Array\nSparseMatrixCSC\nBandedMatrix\nBlockBandedMatrix","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"Additionally, the function sparse is overloaded to give the most efficient matrix type for a given operator. For one-dimensional derivatives this is a BandedMatrix, while for higher-dimensional operators this is a BlockBandedMatrix. The concretizations are made to act on vec(u).","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"A contraction operator concretizes to an ordinary matrix, no matter which dimension the contraction acts along, by doing the Kronecker product formulation. I.e., the action of the built matrix will match the action on vec(u).","category":"page"},{"location":"operators/derivative_operators/#Boundary-Condition-Operators","page":"Derivative Operators","title":"Boundary Condition Operators","text":"","category":"section"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"Boundary conditions are implemented through a ghost node approach. The discretized values u should be the interior of the domain so that, for the boundary value operator Q, Q*u is the discretization on the closure of the domain. By using it like this, L*Q*u is the NxN operator which satisfies the boundary conditions.","category":"page"},{"location":"operators/derivative_operators/#Periodic-Boundary-Conditions","page":"Derivative Operators","title":"Periodic Boundary Conditions","text":"","category":"section"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"The constructor PeriodicBC provides the periodic boundary condition operator.","category":"page"},{"location":"operators/derivative_operators/#Robin-Boundary-Conditions","page":"Derivative Operators","title":"Robin Boundary Conditions","text":"","category":"section"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"The variables in l are [αl, βl, γl], and correspond to a BC of the form al*u(0) + bl*u'(0) = cl, and similarly r for the right boundary ar*u(N) + br*u'(N) = cl.","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"RobinBC(l::AbstractArray{T}, r::AbstractArray{T}, dx::AbstractArray{T}, order = one(T))","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"Additionally, the following helpers exist for the Neumann u'(0) = α and Dirichlet u(0) = α cases.","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"DirichletBC(αl::T, αr::T)\nDirichlet0BC(T::Type) = DirichletBC(zero(T), zero(T))","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"This fixes u = αl at the first point of the grid, and u = αr at the last point.","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"Neumann0BC(dx::Union{AbstractVector{T}, T}, order = 1)\nNeumannBC(α::AbstractVector{T}, dx::AbstractVector{T}, order = 1)","category":"page"},{"location":"operators/derivative_operators/#General-Boundary-Conditions","page":"Derivative Operators","title":"General Boundary Conditions","text":"","category":"section"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"Implements a generalization of the Robin boundary condition, where α is a vector of coefficients. Represents a condition of the form α[1] + α[2]u[0] + α[3]u'[0] + α[4]u''[0]+... = 0","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"GeneralBC(αl::AbstractArray{T}, αr::AbstractArray{T}, dx::AbstractArray{T}, order = 1)","category":"page"},{"location":"operators/derivative_operators/#Operator-Actions","page":"Derivative Operators","title":"Operator Actions","text":"","category":"section"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"The boundary condition operators act lazily by appending the appropriate values to the end of the array, building the ghost-point extended version for the derivative operator to act on. This utilizes special array types to not require copying the interior data.","category":"page"},{"location":"operators/derivative_operators/#Concretizations-2","page":"Derivative Operators","title":"Concretizations","text":"","category":"section"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"The following concretizations are provided:","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"Array\nSparseMatrixCSC","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"Additionally, the function sparse is overloaded to give the most efficient matrix type for a given operator. For these operators it's SparseMatrixCSC. The concretizations are made to act on vec(u).","category":"page"},{"location":"operators/derivative_operators/#GhostDerivative-Operators","page":"Derivative Operators","title":"GhostDerivative Operators","text":"","category":"section"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"When L is a DerivativeOperator and Q is a boundary condition operator, L*Q produces a GhostDerivative operator which is the composition of the two operations.","category":"page"},{"location":"operators/derivative_operators/#Concretizations-3","page":"Derivative Operators","title":"Concretizations","text":"","category":"section"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"The following concretizations are provided:","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"Array\nSparseMatrixCSC\nBandedMatrix","category":"page"},{"location":"operators/derivative_operators/","page":"Derivative Operators","title":"Derivative Operators","text":"Additionally, the function sparse is overloaded to give the most efficient matrix type for a given operator. For these operators it's BandedMatrix unless the boundary conditions are PeriodicBC, in which case it's SparseMatrixCSC. The concretizations are made to act on vec(u).","category":"page"},{"location":"#DiffEqOperators.jl","page":"DiffEqOperators.jl: Linear operators for Scientific Machine Learning","title":"DiffEqOperators.jl","text":"","category":"section"},{"location":"","page":"DiffEqOperators.jl: Linear operators for Scientific Machine Learning","title":"DiffEqOperators.jl: Linear operators for Scientific Machine Learning","text":"DiffEqOperators.jl is a package for finite difference discretization of partial differential equations. It serves two purposes:","category":"page"},{"location":"","page":"DiffEqOperators.jl: Linear operators for Scientific Machine Learning","title":"DiffEqOperators.jl: Linear operators for Scientific Machine Learning","text":"Building fast lazy operators for high order non-uniform finite differences.\nAutomated finite difference discretization of symbolically-defined PDEs.","category":"page"},{"location":"#Note:-(2)-is-still-a-work-in-progress!","page":"DiffEqOperators.jl: Linear operators for Scientific Machine Learning","title":"Note: (2) is still a work in progress!","text":"","category":"section"},{"location":"","page":"DiffEqOperators.jl: Linear operators for Scientific Machine Learning","title":"DiffEqOperators.jl: Linear operators for Scientific Machine Learning","text":"For the operators, both centered and upwind operators are provided, for domains of any dimension, arbitrarily spaced grids, and for any order of accuracy. The cases of 1, 2, and 3 dimensions with an evenly spaced grid are optimized with a convolution routine from NNlib.jl. Care is taken to give efficiency by avoiding unnecessary allocations, using purpose-built stencil compilers, allowing GPUs and parallelism, etc. Any operator can be concretized as an Array, a BandedMatrix or a sparse matrix.","category":"page"},{"location":"operators/jacobian_vector_product/#Jacobian-Vector-Product-Operators","page":"Jacobian-Vector Product Operators","title":"Jacobian-Vector Product Operators","text":"","category":"section"},{"location":"operators/jacobian_vector_product/","page":"Jacobian-Vector Product Operators","title":"Jacobian-Vector Product Operators","text":"JacVecOperator{T}(f,u::AbstractArray,p=nothing,t::Union{Nothing,Number}=nothing;autodiff=true,ishermitian=false,opnorm=true)","category":"page"},{"location":"operators/jacobian_vector_product/","page":"Jacobian-Vector Product Operators","title":"Jacobian-Vector Product Operators","text":"The JacVecOperator is a linear operator J*v where J acts like df/du for some function f(u,p,t). For in-place operations mul!(w,J,v), f is an in-place function f(du,u,p,t).","category":"page"}]
}
